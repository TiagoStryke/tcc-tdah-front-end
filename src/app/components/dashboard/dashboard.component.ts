import * as ApexCharts from 'apexcharts';
import * as mockData from 'src/app/helpers/mockData';

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  chartDays!: chartDaysBuilder;
  chartDaysRender!: ApexCharts;
  chartPoints!: chartBarBuilder;
  // chartPointsRender!: ApexCharts;
  // chartTimeAssignment!: chartBarBuilder;
  // chartTimeAssignmentRender!: ApexCharts;
  // chartTimeClickColor!: chartBarBuilder;
  // chartTimeClickColorRender!: ApexCharts;
  token = localStorage.getItem('token');
  user: any;
  userId: any;
  profilePhoto: string | undefined;
  searchBar: boolean = true;
  main: boolean = true;
  patientId: string = '';
  picker: any;
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
  chartsTitlesAndInputIds: any;

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
    this.getChartsTitlesAndInputIds();
    this.loadResults();
    this.showCharts();
  }

  ifChecked(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;

    if (isChecked) {
      // if (this.filtersForm.value.start && this.filtersForm.value.end) {
      //   this.chartDays = new chartDaysBuilder({
      //     days: this.gameResults.length,
      //     //TODO count the days not the lenght of the array
      //     percentage:
      //       (this.gameResults.length * 100) /
      //       this.subtractDates(
      //         new Date(this.filtersForm.value.start),
      //         new Date(this.filtersForm.value.end)
      //       ),
      //   });
      //   this.chartDaysRender = new ApexCharts(
      //     document.querySelector('#chartDays'),
      //     this.chartDays.getOptionsChartDays()
      //   );
      //   this.chartDaysRender.render();
      // }
      console.log(event.target);
    } else {
      console.log('Checkbox is not checked');
    }
  }

  loadResults() {
    if (this.filtersForm.valid) {
      this.getGameResults();
    }
  }

  getGameResults() {
    if (
      this.filtersForm.value.start != null &&
      this.filtersForm.value.end != null &&
      this.filtersForm.value.gameSelected != null &&
      this.filtersForm.value.soundStimuli != null
    ) {
      this.rService
        .listResultsbyDate2(
          this.patientId,
          this.filtersForm.value.gameSelected,
          new Date(this.filtersForm.value.start).toISOString(),
          new Date(this.filtersForm.value.end).toISOString(),
          this.filtersForm.value.soundStimuli
        )
        .subscribe((res) => {
          this.gameResults = res.body;
        });
    }
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

    if (
      this.filtersForm.valid &&
      warning &&
      !warning.classList.contains('hidden') &&
      info
    ) {
      this.toggleHidden(warning);
      this.toggleHidden(info);
    }
  }

  getChartsTitlesAndInputIds() {
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

      this.chartsTitlesAndInputIds = [
        {
          title: 'Dias usando a plataforma',
          id: 'daysLogged',
        },
      ].concat(
        chartsTitles.map((title: any, index: string | number) => ({
          title,
          id: inputIds[index],
        }))
      );
    }
    console.log(this.chartsTitlesAndInputIds);
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

  loadCharts() {
    //TODO - get data to plot charts on backend
    // this.chartDays = new chartDaysBuilder(this.charts.chartDaysData);
    // this.chartPoints = new chartBarBuilder(
    //   this.soundSelect,
    //   { type: 'points' },
    //   this.charts.chartPointsData
    // );
    // this.chartTimeAssignment = new chartBarBuilder(
    //   this.soundSelect,
    //   { type: 'time' },
    //   this.charts.chartTimeAssignmentData
    // );
    // this.chartTimeClickColor = new chartBarBuilder(
    //   this.soundSelect,
    //   { type: 'time' },
    //   this.charts.chartTimeClickColorData
    // );
  }

  renderCharts() {
    this.chartDaysRender = new ApexCharts(
      document.querySelector('#chartDays'),
      this.chartDays.getOptionsChartDays()
    );
    this.chartDaysRender.render();

    // this.chartPointsRender = new ApexCharts(
    //   document.querySelector('#chartPoints'),
    //   this.chartPoints.getOptionsChartPoints()
    // );
    // this.chartPointsRender.render();

    // this.chartTimeAssignmentRender = new ApexCharts(
    //   document.querySelector('#chartTimeAssignment'),
    //   this.chartTimeAssignment.getOptionsChartPoints()
    // );
    // this.chartTimeAssignmentRender.render();

    // this.chartTimeClickColorRender = new ApexCharts(
    //   document.querySelector('#chartTimeClickColor'),
    //   this.chartTimeClickColor.getOptionsChartPoints()
    // );
    // this.chartTimeClickColorRender.render();
  }
  //TODO i think this is not needed
  updateCharts() {
    this.chartDaysRender.updateOptions(
      this.chartDays.getOptionsChartDays(),
      true
    );
    // this.chartPointsRender.updateOptions(
    //   this.chartPoints.getOptionsChartPoints()
    // );

    // this.chartTimeAssignmentRender.updateOptions(
    //   this.chartTimeAssignment.getOptionsChartPoints()
    // );

    // this.chartTimeClickColorRender.updateOptions(
    //   this.chartTimeClickColor.getOptionsChartPoints()
    // );
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

    if (this.patient.birthDate) {
      const today = new Date();
      const birthDate = new Date(this.patient.birthDate);

      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      this.patient.age = age;
      this.patient.birthDateFormatted = new Date(
        this.patient.birthDate
      ).toLocaleDateString('pt-BR');
    }

    if (this.patient.diagnosisDate) {
      this.patient.diagnosisDateFormatted = new Date(
        this.patient.diagnosisDate
      ).toLocaleDateString('pt-BR');
    }
    if (this.patient.createdAt) {
      const therapyStart = new Date(this.patient.createdAt);
      const therapyEnd = new Date();
      const diffTime = Math.abs(therapyEnd.getTime() - therapyStart.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 30) {
        this.patient.therapyTime =
          diffDays === 1 ? diffDays + ' dia' : diffDays + ' dias';
      } else {
        const diffYears = Math.floor(diffDays / 365);
        const diffMonths = Math.floor((diffDays - diffYears * 365) / 30) % 12;
        const diffMonthString =
          diffMonths === 1 ? diffMonths + ' mês' : diffMonths + ' meses';
        const diffYearString =
          diffYears === 1 ? diffYears + ' ano' : diffYears + ' anos';
        const diffDayString =
          diffDays - diffYears * 365 - diffMonths * 30 + ' dias';

        if (diffYears > 0 && diffMonths > 0 && diffDays > 0) {
          this.patient.therapyTime =
            diffYearString + ', ' + diffMonthString + ' e ' + diffDayString;
        } else if (diffYears > 0 && diffMonths === 0) {
          this.patient.therapyTime = diffYearString;
        } else if (diffYears > 0 && diffMonths > 0) {
          this.patient.therapyTime = diffYearString + ' e ' + diffMonthString;
        } else if (diffMonths > 0 && diffDays === 0) {
          this.patient.therapyTime = diffMonthString;
        } else if (diffMonths > 0 && diffDays > 0) {
          this.patient.therapyTime = diffMonthString + ' e ' + diffDayString;
        }
      }
    }
  }
}
