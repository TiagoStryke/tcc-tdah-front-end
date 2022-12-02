import { Component, OnInit } from '@angular/core';

import { getMatFormFieldDuplicatedHintError } from '@angular/material/form-field';

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
    dataNascimento: '01-01-1999',
    email: 'rafa@gmail.com',
    codLogin: '#1xs3db',
    dataDiagnostico: '2020-01-01',
    tempoTerapia: '67',
    outComorbidades: 'Nenhuma',
  };

  idade = 0;
  tempoTerapia = this.getTempoTerapia();

  constructor() {}

  ngOnInit(): void {
    //TODO - get data from backend and sort there, delete this line
    this.listPatients = this.listPatients.sort();
    this.idade = this.getIdade();
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
}
