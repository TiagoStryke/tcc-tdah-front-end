import * as ApexCharts from 'apexcharts';
import * as mockData from 'src/app/helpers/mockData';

import { Component, OnInit } from '@angular/core';
import { chartBarBuilder, chartDaysBuilder } from '../../models/chartsOptions';

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

  downloadPdf() {}
}
