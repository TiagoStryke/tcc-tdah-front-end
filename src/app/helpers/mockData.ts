// mock backend data patients lis

//mock data total
export const total = {
  chartDaysData: { days: 600, percentage: 82 },
  chartPointsData: {
    type: 'total',
    xaxisCategories: ['Total'],
    series: [
      { name: 'Pontos', data: [14780] },
      { name: 'Estímulos sonoros', data: [15690] },
    ],
  },
  chartTimeAssignmentData: {
    type: 'total',
    xaxisCategories: ['Total'],
    series: [
      { name: 'Segundos', data: [30] },
      { name: 'Estímulos sonoros', data: [20] },
    ],
  },
  chartTimeClickColorData: {
    type: 'total',
    xaxisCategories: ['Total'],
    series: [
      { name: 'Segundos', data: [1.7] },
      { name: 'Estímulos sonoros', data: [1.5] },
    ],
  },
};

//mock data last seven days
// TODO - calculate the last seven days xaxisCategories in backend
export const lastSevenDays = {
  chartDaysData: { days: 3, percentage: 42 },
  chartPointsData: {
    type: 'lastSevenDays',
    xaxisCategories: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
    series: [
      { name: 'Pontos', data: [50, , , 30, , , 120] },
      { name: 'Estímulos sonoros', data: [60, , , 40, , , 130] },
    ],
  },
  chartTimeAssignmentData: {
    type: 'lastSevenDays',
    xaxisCategories: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
    series: [
      { name: 'Segundos', data: [30, , , 23, , , 10] },
      { name: 'Estímulos sonoros', data: [20, , , 15, , , 8] },
    ],
  },
  chartTimeClickColorData: {
    type: 'lastSevenDays',
    xaxisCategories: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
    series: [
      { name: 'Segundos', data: [2, , , 2, , , 1] },
      { name: 'Estímulos sonoros', data: [1.5, , , 1, , , 0.4] },
    ],
  },
};

//mock data last week
export const lastWeek = {
  chartDaysData: { days: 7, percentage: 100 },
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

//mock data this month
export const thisMonth = {
  chartDaysData: { days: 13, percentage: 43 },
  chartPointsData: {
    type: 'thisMonth',
    xaxisCategories: ['1ª Semana', '2ª Semana', '3ª Semana', '4ª Semana'],
    series: [
      { name: 'Pontos', data: [250, 300, , ,] },
      { name: 'Estímulos sonoros', data: [260, 320, , ,] },
    ],
  },
  chartTimeAssignmentData: {
    type: 'thisMonth',
    xaxisCategories: ['1ª Semana', '2ª Semana', '3ª Semana', '4ª Semana'],
    series: [
      { name: 'Segundos', data: [45, 56, , ,] },
      { name: 'Estímulos sonoros', data: [44, 50, , ,] },
    ],
  },
  chartTimeClickColorData: {
    type: 'thisMonth',
    xaxisCategories: ['1ª Semana', '2ª Semana', '3ª Semana', '4ª Semana'],
    series: [
      { name: 'Segundos', data: [2, 1, , ,] },
      { name: 'Estímulos sonoros', data: [1.5, 0.7, , ,] },
    ],
  },
};

//mock data last month
export const lastMonth = {
  chartDaysData: { days: 25, percentage: 83 },
  chartPointsData: {
    type: 'thisMonth',
    xaxisCategories: ['1ª Semana', '2ª Semana', '3ª Semana', '4ª Semana'],
    series: [
      { name: 'Pontos', data: [350, 280, 420, 230] },
      { name: 'Estímulos sonoros', data: [360, 290, 430, 240] },
    ],
  },
  chartTimeAssignmentData: {
    type: 'thisMonth',
    xaxisCategories: ['1ª Semana', '2ª Semana', '3ª Semana', '4ª Semana'],
    series: [
      { name: 'Segundos', data: [30, 60, 40, 63] },
      { name: 'Estímulos sonoros', data: [20, 50, 35, 55] },
    ],
  },
  chartTimeClickColorData: {
    type: 'thisMonth',
    xaxisCategories: ['1ª Semana', '2ª Semana', '3ª Semana', '4ª Semana'],
    series: [
      { name: 'Segundos', data: [2, 1, 0.8, 2] },
      { name: 'Estímulos sonoros', data: [1.5, 0.7, 0.5, 1] },
    ],
  },
};

//mock data last trimester
export const lastTrimester = {
  chartDaysData: { days: 40, percentage: 44 },
  chartPointsData: {
    type: 'lastTrimester',
    xaxisCategories: ['Setembro', 'Outubro', 'Novembro'],
    series: [
      { name: 'Pontos', data: [850, 680, 920] },
      { name: 'Estímulos sonoros', data: [860, 690, 930] },
    ],
  },
  chartTimeAssignmentData: {
    type: 'lastTrimester',
    xaxisCategories: ['Setembro', 'Outubro', 'Novembro'],
    series: [
      { name: 'Segundos', data: [30, 60, 40] },
      { name: 'Estímulos sonoros', data: [34, 59, 38] },
    ],
  },
  chartTimeClickColorData: {
    type: 'lastTrimester',
    xaxisCategories: ['Setembro', 'Outubro', 'Novembro'],
    series: [
      { name: 'Segundos', data: [2, 1, 0.8] },
      { name: 'Estímulos sonoros', data: [1.5, 0.7, 0.5] },
    ],
  },
};

//mock data last lastSemester
export const lastSemester = {
  chartDaysData: { days: 120, percentage: 67 },
  chartPointsData: {
    type: 'lastSemester',
    xaxisCategories: [
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
    ],
    series: [
      { name: 'Pontos', data: [850, 680, 920, 700, 600, 800] },
      { name: 'Estímulos sonoros', data: [860, 690, 930, 690, 750, 860] },
    ],
  },
  chartTimeAssignmentData: {
    type: 'lastSemester',
    xaxisCategories: [
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
    ],
    series: [
      { name: 'Segundos', data: [30, 60, 40, 80, 60, 54] },
      { name: 'Estímulos sonoros', data: [34, 59, 38, 70, 56, 45] },
    ],
  },
  chartTimeClickColorData: {
    type: 'lastSemester',
    xaxisCategories: [
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
    ],
    series: [
      { name: 'Segundos', data: [2, 1, 0.8, 1.1, 1.2, 2] },
      { name: 'Estímulos sonoros', data: [1.5, 0.7, 0.5, 1, 0.9, 2.2] },
    ],
  },
};

//mock data last thisYear
export const thisYear = {
  chartDaysData: { days: 21, percentage: 6 },
  chartPointsData: {
    type: 'thisYear',
    xaxisCategories: [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ],
    series: [
      { name: 'Pontos', data: [850, 680, 920] },
      { name: 'Estímulos sonoros', data: [860, 690, 930] },
    ],
  },
  chartTimeAssignmentData: {
    type: 'thisYear',
    xaxisCategories: [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ],
    series: [
      { name: 'Segundos', data: [30, 60, 40] },
      { name: 'Estímulos sonoros', data: [34, 59, 38] },
    ],
  },
  chartTimeClickColorData: {
    type: 'thisYear',
    xaxisCategories: [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ],
    series: [
      { name: 'Segundos', data: [2, 1, 0.8] },
      { name: 'Estímulos sonoros', data: [1.5, 0.7, 0.5] },
    ],
  },
};

//mock data last lastYear
export const lastYear = {
  chartDaysData: { days: 325, percentage: 89 },
  chartPointsData: {
    type: 'lastYear',
    xaxisCategories: [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ],
    series: [
      {
        name: 'Pontos',
        data: [850, 680, 920, 700, 600, 800, 850, 680, 920, 700, 600, 800],
      },
      {
        name: 'Estímulos sonoros',
        data: [860, 690, 930, 690, 750, 860, 860, 690, 930, 690, 750, 860],
      },
    ],
  },
  chartTimeAssignmentData: {
    type: 'lastYear',
    xaxisCategories: [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ],
    series: [
      {
        name: 'Segundos',
        data: [30, 60, 40, 80, 60, 54, 30, 60, 40, 80, 60, 54],
      },
      {
        name: 'Estímulos sonoros',
        data: [34, 59, 38, 70, 56, 45, 34, 59, 38, 70, 56, 45],
      },
    ],
  },
  chartTimeClickColorData: {
    type: 'lastYear',
    xaxisCategories: [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ],
    series: [
      {
        name: 'Segundos',
        data: [2, 1, 0.8, 1.1, 1.2, 2, 2, 1, 0.8, 1.1, 1.2, 2],
      },
      {
        name: 'Estímulos sonoros',
        data: [1.5, 0.7, 0.5, 1, 0.9, 2.2, 1.5, 0.7, 0.5, 1, 0.9, 2.2],
      },
    ],
  },
};
