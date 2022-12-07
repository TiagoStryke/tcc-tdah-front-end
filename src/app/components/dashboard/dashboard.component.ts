import * as ApexCharts from 'apexcharts';
import * as mockData from 'src/app/helpers/mockData';

import { Component, OnInit } from '@angular/core';
import { chartBarBuilder, chartDaysBuilder } from '../../models/chartsOptions';

import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  searchText = '';
  patient = mockData.patient; //TODO - delete mock
  charts: any = mockData.lastSevenDays; //TODO - delete mock
  listPatients: any;
  soundSelect = { sound: false };
  idade = 0;
  tempoTerapia = this.getTempoTerapia();
  chartDays!: chartDaysBuilder;
  chartDaysRender!: ApexCharts;
  chartPoints!: chartBarBuilder;
  chartPointsRender!: ApexCharts;
  chartTimeAssignment!: chartBarBuilder;
  chartTimeAssignmentRender!: ApexCharts;
  chartTimeClickColor!: chartBarBuilder;
  chartTimeClickColorRender!: ApexCharts;

  searchBar: boolean = true;
  main: boolean = true;

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
    charts: [
      'Dias usando a plataforma:',
      'Pontuação:',
      'Tempo total para cumprir a tarefa:',
      'Tempo para clicar em uma cor:',
    ],
    select: [],
  };

  constructor() {}

  ngOnInit(): void {
    //TODO - get data from backend and sort there, delete this line
    this.listPatients = mockData.listPatients.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    this.idade = this.getIdade();
    this.loadCharts();
    this.renderCharts();
  }

  getIdFromClick(click: any) {
    let el = document.querySelector('body') as HTMLElement;
    if (el.clientWidth < 576) {
      this.controlDisplay(); //TODO - revise this when getting backend data
    }

    return click.target.id;
  }

  //FIXME - this function is not working properly
  getIdade() {
    const dataNascimento = new Date(this.patient.dataNascimento);
    const dataAtual = new Date();
    const idade = dataAtual.getFullYear() - dataNascimento.getFullYear();
    return idade;
  }
  //TODO - function to transform the days of therapy into months
  getTempoTerapia() {
    return this.patient.tempoTerapia + ' dias';
  }

  selectRange() {
    //TODO - adjust this with the backend calls
    let range = document.querySelector('#range') as HTMLInputElement;

    const rangevalue = range.value as keyof typeof mockData;

    this.charts = mockData[rangevalue];
    this.loadCharts();
    this.updateCharts();
  }

  loadCharts() {
    //TODO - get data to plot charts on backend
    this.chartDays = new chartDaysBuilder(this.charts.chartDaysData);

    this.chartPoints = new chartBarBuilder(
      this.soundSelect,
      { type: 'points' },
      this.charts.chartPointsData
    );

    this.chartTimeAssignment = new chartBarBuilder(
      this.soundSelect,
      { type: 'time' },
      this.charts.chartTimeAssignmentData
    );

    this.chartTimeClickColor = new chartBarBuilder(
      this.soundSelect,
      { type: 'time' },
      this.charts.chartTimeClickColorData
    );
  }

  renderCharts() {
    this.chartDaysRender = new ApexCharts(
      document.querySelector('#chartDays'),
      this.chartDays.getOptionsChartDays()
    );
    this.chartDaysRender.render();

    this.chartPointsRender = new ApexCharts(
      document.querySelector('#chartPoints'),
      this.chartPoints.getOptionsChartPoints()
    );
    this.chartPointsRender.render();

    this.chartTimeAssignmentRender = new ApexCharts(
      document.querySelector('#chartTimeAssignment'),
      this.chartTimeAssignment.getOptionsChartPoints()
    );
    this.chartTimeAssignmentRender.render();

    this.chartTimeClickColorRender = new ApexCharts(
      document.querySelector('#chartTimeClickColor'),
      this.chartTimeClickColor.getOptionsChartPoints()
    );
    this.chartTimeClickColorRender.render();
  }

  updateCharts() {
    this.chartDaysRender.updateOptions(
      this.chartDays.getOptionsChartDays(),
      true
    );
    this.chartPointsRender.updateOptions(
      this.chartPoints.getOptionsChartPoints()
    );

    this.chartTimeAssignmentRender.updateOptions(
      this.chartTimeAssignment.getOptionsChartPoints()
    );

    this.chartTimeClickColorRender.updateOptions(
      this.chartTimeClickColor.getOptionsChartPoints()
    );
  }

  soundStimuliCheck() {
    let checker = document.querySelector('#soundStimuli') as HTMLInputElement;
    this.soundSelect.sound = checker.checked;

    this.loadCharts();
    this.updateCharts();
  }

  downloadPdf() {
    //FIXME - verify if this is the data needed, format the data and add to pdf
    const doc = new jsPDF();
    //write the pdf file
    doc.insertPage(1);
    doc.setPage(1);
    doc.setFontSize(10);
    doc.text('Relatório de Terapia:', 100, 10, { align: 'center' });
    //FIXME - this whole part is repeating itself put it on a loop
    doc.text(this.labels.info[0], 10, 20);
    doc.text(this.labels.info[1], 10, 30);
    doc.text(this.labels.info[2], 10, 40);
    doc.text(this.labels.info[3], 10, 50);
    doc.text(this.labels.info[4], 10, 60);
    doc.text(this.labels.info[5], 10, 70);
    doc.text(this.labels.info[6], 10, 80);
    //TODO - add the data of selected range with if statement
    doc.text(this.labels.info[7], 10, 90);
    //TODO - add the data of selected checkbox with if statement
    doc.text(this.labels.info[8], 10, 100);

    let posY = [10, 74.25, 148.5, 222.75];
    let posText = [88, 102, 90, 90];

    //FIXME - this whole part is repeating itself put it on a loop
    this.chartDaysRender.dataURI().then((data) => {
      let imgURI = Object.values(data);
      doc.setPage(2);
      //TODO - calculate the size to aways be round
      doc.addImage(imgURI[0], 'PNG', 60, posY[0], 100, 64.25);
      doc.text(this.labels.charts[0], posText[0], posY[0]);
      this.chartPointsRender.dataURI().then((data) => {
        let imgURI = Object.values(data);

        doc.addImage(imgURI[0], 'PNG', 60, posY[1], 100, 64.25);
        doc.text(this.labels.charts[1], posText[1], posY[1]);
        this.chartTimeAssignmentRender.dataURI().then((data) => {
          let imgURI = Object.values(data);

          doc.addImage(imgURI[0], 'PNG', 60, posY[2], 100, 64.25);
          doc.text(this.labels.charts[2], posText[2], posY[2]);
          this.chartTimeClickColorRender
            .dataURI()
            .then((data) => {
              let imgURI = Object.values(data);

              doc.addImage(imgURI[0], 'PNG', 60, posY[3], 100, 64.25);
              doc.text(this.labels.charts[3], posText[3], posY[3]);
            })
            .finally(() => {
              doc.save('relatorio.pdf');
            });
        });
      });
    });
  }

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
}
