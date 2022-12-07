interface interfaceChartDays {
  days?: number;
  percentage?: number;
}

export class chartDaysBuilder {
  constructor({ days = 0, percentage = 0 }: interfaceChartDays) {
    this.optionsChartDays.series[0] = percentage;

    if (percentage <= 25) {
      this.optionsChartDays.fill.colors = [this.failColor];
    }
    if (percentage > 25 && percentage <= 50) {
      this.optionsChartDays.fill.colors = [this.warningColor];
    }
    if (percentage > 50 && percentage <= 75) {
      this.optionsChartDays.fill.colors = [this.normalColor];
    }
    if (percentage > 75 && percentage < 100) {
      this.optionsChartDays.fill.colors = [this.almostColor];
    }
    if (percentage == 100) {
      this.optionsChartDays.fill.colors = [this.successColor];
    }
    this.optionsChartDays.labels[0] = days + ' dias';
  }

  getOptionsChartDays() {
    return this.optionsChartDays;
  }

  failColor = '#cc0b08';
  warningColor = '#eed202';
  normalColor = '#8c9eff';
  almostColor = '#41f1b6';
  successColor = '#41f167';

  optionsChartDays = {
    series: [0],
    chart: {
      height: 350,
      type: 'radialBar',
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -180,
        endAngle: 180,
        hollow: {
          margin: 0,
          size: '70%',
          background: '#fff',
          image: undefined,
          imageOffsetX: 0,
          imageOffsetY: 0,
          position: 'front',
          dropShadow: {
            enabled: true,
            top: 3,
            left: 0,
            blur: 4,
            opacity: 0.24,
          },
        },
        track: {
          background: '#fff',
          strokeWidth: '67%',
          margin: 0, // margin is in pixels
          dropShadow: {
            enabled: true,
            top: -3,
            left: 0,
            blur: 4,
            opacity: 0.35,
          },
        },

        dataLabels: {
          show: true,
          name: {
            offsetY: -10,
            show: true,
            color: '#7d8da1',
            fontSize: '17px',
          },
          value: {
            formatter: function (val: string) {
              return parseInt(val) + '%';
            },
            color: '#363949',
            fontSize: '36px',
            show: true,
          },
        },
      },
    },
    fill: {
      colors: [''],
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'horizontal',
        shadeIntensity: 0.4,
        opacityFrom: 0.9,
        opacityTo: 1,
      },
    },
    stroke: {
      lineCap: 'round',
    },
    labels: [''],
  };
}

interface interfaceChartBar {
  type?: string;
  series?: any;
  xaxisCategories?: string[];
}

export class chartBarBuilder {
  constructor(
    { sound }: { sound: boolean },
    { type }: { type: string },
    {
      series = { name: '', data: [0] },
      xaxisCategories = [''],
    }: interfaceChartBar
  ) {
    this.optionsChartBar.xaxis.categories = xaxisCategories;
    sound
      ? (this.optionsChartBar.series = series)
      : (this.optionsChartBar.series[0] = series[0]);

    if (type === 'time') {
      this.optionsChartBar.yaxis.title.text = this.typeSeconds;
      this.optionsChartBar.tooltip.y.formatter = (val: string) => {
        return val + this.typeSeconds;
      };
    } else {
      this.optionsChartBar.yaxis.title.text = this.typePoints;
      this.optionsChartBar.tooltip.y.formatter = (val: string) => {
        return val + this.typePoints;
      };
    }
  }

  getOptionsChartPoints() {
    return this.optionsChartBar;
  }

  typePoints: string = ' Pontos';
  typeSeconds: string = ' Segundos';

  optionsChartBar = {
    series: [{}],
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    noData: {
      text: 'Loading...',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
        dataLabels: {
          position: 'top', // top, center, bottom
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: string) {
        return val;
      },
      offsetY: -30,
      style: {
        fontSize: '10px',
        colors: ['#304758'],
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: [''],
    },
    yaxis: {
      title: {
        text: '',
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val: string) {
          return val + '';
        },
      },
    },
  };
}
