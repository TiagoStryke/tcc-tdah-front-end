import * as ApexCharts from 'apexcharts';
import * as mockData from 'src/app/helpers/mockData';
import * as moment from 'moment';

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, of, tap } from 'rxjs';
import { chartBarBuilder, chartDaysBuilder } from '../../models/charts-options';

import { DateRange } from '@angular/material/datepicker';
import { Game } from '../Interfaces/game';
import { GameResults } from '../Interfaces/gameResults';
import { GameResultsService } from 'src/app/services/game-results.service';
import { GameService } from 'src/app/services/game.service';
import { JWT_token } from 'src/app/services/jwt.token';
import Patient from '../Interfaces/Patient';
import { PatientService } from 'src/app/services/patient.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { interfaceChartBar } from '../../models/charts-options';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  searchText = '';
  patient: Patient = {};
  userName: string | undefined = '';
  listPatients: any;
  token = localStorage.getItem('token');
  user: any;
  userId: any;
  profilePhoto: string | undefined;
  searchBar: boolean = true;
  patientId: string = '';
  labels = {
    info: [
      'Nome: ',
      'Data de nascimento: ',
      'E-mail: ',
      'Código de login: ',
      'Data do diagnóstico de TDAH: ',
      'Tempo de terapia em curso: ',
      'Outras comorbidades: ',
      'Período: ',
      'Presença de estímulos sonoros: ',
    ],
  };
  games: any = [{ name: 'Nenhum jogo cadastrado' }];
  filtersForm = new FormGroup({
    start: new FormControl('', [Validators.required]),
    end: new FormControl('', [Validators.required]),
    gameSelected: new FormControl('gameNotSelected', [
      Validators.required,
      this.gameSelectedValidator,
    ]),
    soundStimuli: new FormControl('false', [Validators.required]),
  });
  gameResults: any;
  categories: string[] = [];
  series: { name: string; data: (number | undefined)[] }[] = [];
  chartsObj: any;

  constructor(
    private jwtToken: JWT_token,
    private toastr: ToastrService,
    private service: UserService,
    private pService: PatientService,
    private gService: GameService,
    private rService: GameResultsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.getListOfPatients();
    this.listGames();
  }

  filtersChange() {
    this.destroyAllCharts();
    this.getCharts();
    this.getGameResults();
    this.showCharts();
    this.generateXaxisCategories();
    this.loadResults();
  }

  ifChecked(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;
    const index = this.chartsObj.findIndex(
      (item: { id: string | null }) => item.id === checkbox.getAttribute('id')
    );
    if (isChecked) {
      this.renderChart(index);
    } else {
      this.destroyChart(index);
    }
  }

  getGameResults() {
    if (
      this.filtersForm.valid &&
      this.filtersForm.value.gameSelected &&
      this.filtersForm.value.soundStimuli
    ) {
      this.rService
        .listResultsbyPeriod(
          this.patientId,
          this.filtersForm.value.gameSelected,
          moment(this.filtersForm.value.start)
            .startOf('day')
            .utc()
            .toISOString(),
          moment(this.filtersForm.value.end).endOf('day').utc().toISOString(),
          this.filtersForm.value.soundStimuli
        )
        .pipe(
          tap((data) => {
            console.log(data);
          }),
          catchError((error) => {
            console.error(error);
            return of(null);
          })
        )
        .subscribe((res) => {
          this.gameResults = res.body;
        });
    }
  }

  loadResults() {
    if (this.filtersForm.valid) {
      console.log('results = ', this.gameResults);
    }

    //TODO correct results undefined
    if (this.chartsObj && this.gameResults) {
      this.chartsObj.forEach(
        (
          obj: { chart: chartDaysBuilder | chartBarBuilder; measuredIn: any },
          index: number
        ) => {
          if (index === 0) {
            obj.chart = new chartDaysBuilder({
              days: this.countDays(this.gameResults),
              percentage: this.calculatePercentage(),
            });
          } else {
            obj.chart = new chartBarBuilder(
              {
                sound: this.filtersForm.value.soundStimuli
                  ? this.filtersForm.value.soundStimuli
                  : '',
              },
              { type: obj.measuredIn },
              {
                xaxisCategories: this.categories,
                series: this.series,
              }
            );
          }
        }
      );
    }
  }

  generateSeries() {
    this.series = [
      { name: 'Pontos', data: [50, 0, 0, 30, 0, 0, 0, 120] },
      { name: 'Estímulos sonoros', data: [60, , , 40, , , 130] },
    ];
  }

  generateXaxisCategories() {
    if (this.filtersForm.valid) {
      const start = moment(this.filtersForm.value.start);
      const end = moment(this.filtersForm.value.end);
      this.categories = [];

      if (end.diff(start, 'years') > 2) {
        while (start.year() <= end.year()) {
          this.categories.push(start.year().toString());
          start.add(1, 'year');
        }
      } else if (end.diff(start, 'months') > 2) {
        while (start <= end) {
          this.categories.push(start.locale('pt-br').format('MMM'));
          start.add(1, 'month');
        }
      } else {
        while (start <= end) {
          this.categories.push(start.locale('pt-br').format('DD MMM'));
          start.add(1, 'day');
        }
      }
    }
  }

  renderChart(index: number) {
    this.chartsObj[index]['chartRender'] = new ApexCharts(
      document.querySelector('#chart' + this.chartsObj[index].id),
      index === 0
        ? this.chartsObj[index].chart.getOptionsChartDays()
        : this.chartsObj[index].chart.getOptionsChartPoints()
    );

    this.chartsObj[index].chartRender.render();
  }

  destroyChart(index: number) {
    this.chartsObj[index].chartRender.destroy();
  }

  destroyAllCharts() {
    if (this.chartsObj) {
      this.chartsObj.forEach(
        (obj: { chartRender: { destroy: () => void } }) => {
          if (obj.chartRender) {
            obj.chartRender.destroy();
          }
        }
      );
    }
  }

  calculatePercentage() {
    let percentage =
      (this.countDays(this.gameResults) * 100) /
      moment(this.filtersForm.value.end).diff(
        moment(this.filtersForm.value.start),
        'days'
      );
    return percentage;
  }

  countDays(results: any[]): number {
    const days = new Set<string>();
    results.forEach((result) => {
      const day = result.date.substring(0, 10);
      days.add(day);
    });
    return days.size;
  }

  subtractDates(date1: Date, date2: Date): number {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    return timeDiff / (1000 * 3600 * 24);
  }

  gameSelectedValidator(control: FormControl) {
    if (control.value === 'gameNotSelected') {
      return { gameSelected: true };
    }
    return null;
  }

  toggleHidden(element: Element) {
    element.classList.toggle('hidden');
  }

  showPatientInformation() {
    let info = document.querySelector('.patientSelected');
    let warning = document.querySelector('.noPatientSelected');

    if (warning && !warning.classList.contains('hidden') && info) {
      this.toggleHidden(warning);
      this.toggleHidden(info);
    }
  }

  showFilters() {
    let info = document.querySelector('.patientSelectedFilters');
    let warning = document.querySelector('.noPatientSelectedFilters');

    if (warning && !warning.classList.contains('hidden') && info) {
      this.toggleHidden(warning);
      this.toggleHidden(info);
    }
  }

  showCharts() {
    let info = document.querySelector('.filtersSelected');
    let warning = document.querySelector('.noFiltersSelected');

    if (this.filtersForm.valid && this.gameResults) {
      if (warning && !warning.classList.contains('hidden') && info) {
        this.toggleHidden(warning);
        this.toggleHidden(info);
      }
    } else if (warning && info) {
      this.toggleHidden(warning);
      this.toggleHidden(info);
    }
  }

  getCharts() {
    const selectedGame = this.games.find(
      (game: { _id: string | null | undefined }) =>
        game._id === this.filtersForm.value.gameSelected
    );

    if (selectedGame) {
      let chartsTitles = selectedGame.resultsStructure.map(
        (object: { portugueseTitle: any }) => object.portugueseTitle
      );
      let inputIds = selectedGame.resultsStructure.map(
        (object: { fieldName: any }) => object.fieldName
      );

      this.chartsObj = [
        {
          title: 'Dias usando a plataforma',
          id: 'daysLogged',
          chart: new chartDaysBuilder({}),
        },
      ].concat(
        chartsTitles.map((title: any, index: string | number) => ({
          title,
          id: inputIds[index],
          measuredIn: selectedGame.resultsStructure[index].measuredIn,
          chart: new chartBarBuilder({ sound: '' }, { type: '' }, {}),
        }))
      );
    }
  }

  listGames() {
    this.gService.listGames().subscribe((res) => {
      this.games = res.body;
    });
  }

  getIdFromClick(click: any) {
    let el = document.querySelector('body') as HTMLElement;
    if (el.clientWidth < 576) {
      this.controlDisplay();
    }
    this.patientId = click.target.id;
    this.showPatientInformation();
    this.showFilters();
    this.loadPatientInfo();
  }

  findIndexById(array: any[], id: string): number {
    return array.findIndex((item) => item._id === id);
  }

  downloadPdf() {
    //FIXME - verify if this is the data needed, format the data and add to pdf
    // const doc = new jsPDF();
    // //write the pdf file
    // doc.insertPage(1);
    // doc.setPage(1);
    // doc.setFontSize(10);
    // doc.text('Relatório de Terapia:', 100, 10, { align: 'center' });
    // //FIXME - this whole part is repeating itself put it on a loop
    // doc.text(this.labels.info[0], 10, 20);
    // doc.text(this.labels.info[1], 10, 30);
    // doc.text(this.labels.info[2], 10, 40);
    // doc.text(this.labels.info[3], 10, 50);
    // doc.text(this.labels.info[4], 10, 60);
    // doc.text(this.labels.info[5], 10, 70);
    // doc.text(this.labels.info[6], 10, 80);
    // //TODO - add the data of selected range with if statement
    // doc.text(this.labels.info[7], 10, 90);
    // //TODO - add the data of selected checkbox with if statement
    // doc.text(this.labels.info[8], 10, 100);
    // let posY = [10, 74.25, 148.5, 222.75];
    // let posText = [88, 102, 90, 90];
    // //FIXME - this whole part is repeating itself put it on a loop
    // this.chartDaysRender.dataURI().then((data) => {
    //   let imgURI = Object.values(data);
    //   doc.setPage(2);
    //   //TODO - calculate the size to aways be round
    //   doc.addImage(imgURI[0], 'PNG', 60, posY[0], 100, 64.25);
    //   doc.text(this.labels.charts[0], posText[0], posY[0]);
    //   this.chartPointsRender.dataURI().then((data) => {
    //     let imgURI = Object.values(data);
    //     doc.addImage(imgURI[0], 'PNG', 60, posY[1], 100, 64.25);
    //     doc.text(this.labels.charts[1], posText[1], posY[1]);
    //     this.chartTimeAssignmentRender.dataURI().then((data) => {
    //       let imgURI = Object.values(data);
    //       doc.addImage(imgURI[0], 'PNG', 60, posY[2], 100, 64.25);
    //       doc.text(this.labels.charts[2], posText[2], posY[2]);
    //       this.chartTimeClickColorRender
    //         .dataURI()
    //         .then((data) => {
    //           let imgURI = Object.values(data);
    //           doc.addImage(imgURI[0], 'PNG', 60, posY[3], 100, 64.25);
    //           doc.text(this.labels.charts[3], posText[3], posY[3]);
    //         })
    //         .finally(() => {
    //           doc.save('relatorio.pdf');
    //         });
    //     });
    //   });
    // });
  }

  //TODO do this better - use .classList.toggle
  controlDisplay() {
    let aside = document.querySelector('#aside') as HTMLElement;
    let menuButton = document.querySelector('.menu-btn') as HTMLElement;
    let main = document.querySelector('#main') as HTMLElement;
    let body = document.querySelector('body') as HTMLElement;
    if (body.clientWidth < 576) {
      if (this.searchBar) {
        aside.style.display = 'none';
        menuButton.style.display = 'block';
        main.style.display = 'block';
        this.searchBar = false;
      } else {
        aside.style.display = 'block';
        menuButton.style.display = 'block';
        main.style.display = 'none';
        this.searchBar = true;
      }
    }
  }

  //TODO should be a way to get rid of this with media querys
  onResize(event: any) {
    let aside = document.querySelector('#aside') as HTMLElement;
    let menuButton = document.querySelector('.menu-btn') as HTMLElement;
    let main = document.querySelector('#main') as HTMLElement;
    if (event.target.innerWidth > 576) {
      aside.style.display = 'block';
      menuButton.style.display = 'none';
      main.style.display = 'block';
      this.searchBar = true;
    } else if (this.searchBar) {
      main.style.display = 'none';
    }
  }

  toggleOptions() {
    let options = document.querySelector('.options');
    if (options) {
      options.classList.toggle('shrink');
      // options.classList.toggle('invisible');
    }
  }

  logout() {
    localStorage.removeItem('token');
  }

  getUser() {
    if (this.token) {
      this.user = this.jwtToken.decodeToken(this.token);
      this.userId = this.user.userId;
    } else {
      this.toastr.error('Erro efetue o Login novamente!', 'Error');
      this.router.navigate(['/login']);
    }

    this.service.findById(this.userId).subscribe((res) => {
      if (res.body.name) {
        this.userName = res.body.name.split(' ').shift();
        this.profilePhoto = res.body.profilePhoto;
      }
    });
  }

  getListOfPatients() {
    this.pService.listPatients(this.userId).subscribe((res) => {
      this.listPatients = res.body;
    });
  }

  loadPatientInfo() {
    if (!this.listPatients) {
      this.toastr.error('Lista de Pacientes indisponível');
      return;
    }
    if (!this.patient) {
      this.toastr.error('Paciente não encontrado');
      return;
    }

    let index = this.findIndexById(this.listPatients, this.patientId);
    this.patient = this.listPatients[index];

    this.patient.age = moment().diff(moment(this.patient.birthDate), 'years');
    this.patient.birthDateFormatted = moment(this.patient.birthDate).format(
      'L'
    );
    this.patient.diagnosisDateFormatted = moment(
      this.patient.diagnosisDate
    ).format('L');

    const therapyStart = moment(this.patient.createdAt);
    const diffDays = moment().diff(therapyStart, 'days');
    let therapyTime;

    if (diffDays < 30) {
      therapyTime = diffDays + (diffDays === 1 ? ' dia' : ' dias');
    } else {
      const diffYears = moment().diff(therapyStart, 'years');
      const diffMonths = moment().diff(therapyStart, 'months') % 12;
      therapyTime = diffYears + (diffYears === 1 ? ' ano' : ' anos');

      if (diffMonths > 0) {
        therapyTime +=
          ' e ' + diffMonths + (diffMonths === 1 ? ' mês' : ' meses');
      }
    }
    this.patient.therapyTime = therapyTime;
  }
}
