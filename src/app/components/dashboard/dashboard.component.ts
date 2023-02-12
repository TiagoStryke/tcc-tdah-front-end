import * as ApexCharts from 'apexcharts';
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
import html2canvas from 'html2canvas';
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
  chartsObj: any = undefined;

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
    if (
      this.filtersForm.valid &&
      this.filtersForm.controls.start.value &&
      this.filtersForm.controls.end.value
    ) {
      this.getGameResults(
        this.filtersForm.controls.start.value,
        this.filtersForm.controls.end.value
      );
    } else {
      this.destroyAllCharts();
    }

    this.showCharts();
  }

  deletePatient(id: string) {
    this.pService.deletePatient(id).subscribe((res) => {
      this.toastr.success('Paciente excluído com sucesso!');
      this.getListOfPatients();
    });
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

  getGameResults(start: moment.MomentInput, end: moment.MomentInput) {
    start = moment(start);
    end = moment(end);

    if (
      this.filtersForm.value.gameSelected &&
      this.filtersForm.value.soundStimuli &&
      this.filtersForm.valid
    ) {
      if (end.diff(start, 'months') > 2 && end.diff(start, 'years') < 2) {
        this.rService
          .listResultsMonthAverage(
            this.patientId,
            this.filtersForm.value.gameSelected,
            start.startOf('day').utcOffset(-180).toISOString(),
            end.endOf('day').utcOffset(-180).toISOString(),
            this.filtersForm.value.soundStimuli
          )
          .pipe(
            catchError((error) => {
              this.toastr.error(error);
              return of(null);
            })
          )
          .subscribe((res) => {
            this.loadResults(res.body);
          });
      } else if (end.diff(start, 'years') > 2) {
        this.rService
          .listResultsYearAverage(
            this.patientId,
            this.filtersForm.value.gameSelected,
            start.startOf('day').utcOffset(-180).toISOString(),
            end.endOf('day').utcOffset(-180).toISOString(),
            this.filtersForm.value.soundStimuli
          )
          .pipe(
            catchError((error) => {
              this.toastr.error(error);
              return of(null);
            })
          )
          .subscribe((res) => {
            this.loadResults(res.body);
          });
      } else {
        this.rService
          .listResultsbyPeriod(
            this.patientId,
            this.filtersForm.value.gameSelected,
            start.startOf('day').utcOffset(-180).toISOString(),
            end.endOf('day').utcOffset(-180).toISOString(),
            this.filtersForm.value.soundStimuli
          )
          .pipe(
            catchError((error) => {
              this.toastr.error(error);
              return of(null);
            })
          )
          .subscribe((res) => {
            this.loadResults(res.body);
          });
      }
    }
  }

  loadResults(gameResults: GameResults[]) {
    if (this.filtersForm.valid && gameResults) {
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
            chart: new chartDaysBuilder({
              days: this.countDays(gameResults),
              percentage: this.calculatePercentage(gameResults),
            }),
          },
        ].concat(
          chartsTitles.map((title: any, index: string | number) => ({
            title,
            id: inputIds[index],
            chart: new chartBarBuilder(
              {
                sound: this.filtersForm.value.soundStimuli
                  ? this.filtersForm.value.soundStimuli
                  : 'error',
              },
              { type: selectedGame.resultsStructure[index].measuredIn },
              {
                xaxisCategories: this.generateXaxisCategories(gameResults),
                series: this.generateSeries(
                  selectedGame.resultsStructure[index].measuredIn,
                  gameResults,
                  inputIds[index]
                ),
              }
            ),
          }))
        );
      }
    }
  }

  generateSeries(name: string, results: GameResults[], id: string) {
    let series: { name: string; data: number[] }[] = [];

    let data = results.map(
      (result) => result.results[id].toFixed(1) as unknown as number
    );

    series.push({
      name: name,
      data: data,
    });
    return series;
  }

  generateXaxisCategories(r: any) {
    let categories: string[] = [];
    let dateStrings: string[] = [];

    for (let i = 0; i < r.length; i++) {
      if (r[i].date) {
        const date = moment.utc(r[i].date);
        const dateString = `${date
          .date()
          .toString()
          .padStart(2, '0')} ${date.format('MMM')}`;
        categories.push(dateString);
        dateStrings.push(dateString);
      } else if (r[i].results['month-year']) {
        const [month, year] = r[i].results['month-year'].split('-');
        const dateString = `${moment()
          .month(+month - 1)
          .format('MMM')} ${year}`;
        if (!dateStrings.includes(dateString)) {
          categories.push(dateString);
          dateStrings.push(dateString);
        }
      } else if (r[i].results.year) {
        const dateString = r[i].results.year;
        if (!dateStrings.includes(dateString)) {
          categories.push(dateString);
          dateStrings.push(dateString);
        }
      }
    }

    return categories;
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

  calculatePercentage(gameResults: any[]) {
    let percentage =
      (this.countDays(gameResults) * 100) /
      moment(this.filtersForm.value.end).diff(
        moment(this.filtersForm.value.start),
        'days'
      );
    return percentage;
  }

  countDays(results: any[]): number {
    let days = 0;
    results.forEach((result) => {
      days += result.daysLogged;
    });
    return days;
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
    if (warning && info && this.filtersForm.valid) {
      info.classList.remove('hidden');
      warning.classList.add('hidden');
    } else if (warning && info) {
      info.classList.add('hidden');
      warning.classList.remove('hidden');
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

  async downloadPdf() {
    const data = document.getElementById('main');
    let canvas: any;
    if (data) {
      canvas = await html2canvas(data, { scale: 2 });
    }

    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 211, 298);
    pdf.save(`Relatório-${new Date().toLocaleDateString()}.pdf`);
  }

  controlDisplay() {
    let aside = document.querySelector('#aside') as HTMLElement;
    let main = document.querySelector('#main') as HTMLElement;
    let body = document.querySelector('body') as HTMLElement;
    if (body.clientWidth < 576) {
      if (this.searchBar) {
        aside.style.display = 'none';
        main.style.display = 'block';
        this.searchBar = false;
      } else {
        aside.style.display = 'block';
        main.style.display = 'none';
        this.searchBar = true;
      }
    }
  }

  onResize(event: any) {
    let aside = document.querySelector('#aside') as HTMLElement;
    let main = document.querySelector('#main') as HTMLElement;
    if (event.target.innerWidth > 576) {
      aside.style.display = 'block';
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
