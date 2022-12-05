import * as ApexCharts from 'apexcharts';

import { Component, OnInit } from '@angular/core';
import { chartBarBuilder, chartDaysBuilder } from '../../models/chartsOptions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  searchText = '';

  // mock backend data patients list
  listPatients = [
    'Rafaela Souza Teixeira',
    'Keline Pinheiro Araujo',
    'Kênia Stephanie Nunes Arruda',
    'Larissi Araujo da Silva',
    'Lorena Alcântara de Farias',
    'Railma R. Medeiros da Silva',
    'Ramile Souza Teixeira',
    'Dinara Regina Azevedo Gadelha',
    'Edilmara das Neves Silva',
    'Gabriela Freire Cordeiro de Oliveira',
    'Glenda Eloíse de P. Feitosa',
    'Lorena Freire Alves de Oliveira',
    'Louise Mariane Abreu de Paiva',
    'Luana Priscila Fernandes',
    'Maria Gisele da Silva de Oliveira',
    'Maria Isabel Azevedo Gomes',
    'Maria Isabel Paiva Gomes',
    'Sandrielly do Prado Juvencio',
    'Aracelly Maria Guerra Azevedo',
    'Debora Kaynara Patricio da Silva',
    'Débora Larissa Silva de Souza',
    'Maria José Santana dos Santos',
    'Maria Luisa Cavalcante de Moraes',
    'Mariana Salles Franco Torres',
    'Jéssica do Vale Soares',
    'Jéssica Ketlen Soares de Oliveira',
    'Kalyne Ribeiro Dantas Q. de Vasconcelos',
    'Alexsandra Santana dos Santos',
    'Aline Aprígio da Silva',
    'Amanda C. Moreira',
    'Ana Priscila de Meireles de Melo',
    'Anne Maria de Alves',
    'Anny Karoliny Oliveira Lima',
    'Nathália Alcântara de Farias',
    'Patrícia Kallyane do Vale Peixoto',
    'Priscila Ramos de Melo',
    'Rafaela Laureano Wanderley',
    'Sara da G. Ferreira',
    'Simone Karla Costa da Silva',
    'Suelen da Silva Sousa',
    'Miriam Síria R. de Souza',
    'Mirna Souza da Silva',
    'Helouise Thainá da S. Mâcedo',
    'Irene Hamara da Costa Oliveira',
    'Ivamastk Maria Pedrosa',
  ];

  // mock backend data patient info
  patient = {
    id: '0',
    nome: 'Rafaela Laureano Wanderley',
    dataNascimento: '01/01/1999',
    email: 'rafa@gmail.com',
    codLogin: '#1xs3db',
    dataDiagnostico: '01/01/2020',
    tempoTerapia: '67',
    outComorbidades: 'Nenhuma',
  };

  // mock backend data charts
  // TODO - treat the undefined values
  charts = {
    chartDaysData: { days: 3, percentage: 45 },
    chartPointsData: {
      type: 'week',
      xaxisCategories: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
      series: [
        { name: 'Pontos', data: [50, 80, 20, 30, 40, 90, 120] },
        { name: 'Estímulos sonoros', data: [60, 90, 30, 40, 50, 100, 130] },
      ],
    },
    chartTimeAssignmentData: {
      type: 'week',
      xaxisCategories: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
      series: [
        { name: 'Segundos', data: [30, 20, 40, 23, 40, 50, 10] },
        { name: 'Estímulos sonoros', data: [20, 10, 35, 15, 25, 42, 8] },
      ],
    },
    chartTimeClickColorData: {
      type: 'week',
      xaxisCategories: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
      series: [
        { name: 'Segundos', data: [2, 1, 0.8, 2, 0.6, 2, 1] },
        { name: 'Estímulos sonoros', data: [1.5, 0.7, 0.5, 1, 0.3, 1.2, 0.4] },
      ],
    },
  };

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
    this.listPatients = this.listPatients.sort();
    this.idade = this.getIdade();
    this.loadCharts();
    this.renderCharts();
  }

  clickWorking(e: any) {
    console.log(e);
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
}
