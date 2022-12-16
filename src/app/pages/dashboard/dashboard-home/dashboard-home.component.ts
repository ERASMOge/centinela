import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Options } from '@popperjs/core';
import { ApexOptions, ApexPlotOptions, ChartComponent } from "ng-apexcharts";
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexYAxis,
  ApexLegend,
  ApexFill
} from "ng-apexcharts";


export type ChartOptions2 = {
  plotOptions: any|ApexPlotOptions;
title:any|Title
options:any|ApexChart
  series: any|ApexNonAxisChartSeries;
  chart: any|ApexChart;
  responsive: any|ApexResponsive[];
  labels: any;
  xaxis: any|ApexXAxis;
  dataLabels: any|ApexDataLabels;
  yaxis: any|ApexYAxis;
  colors: any|string[];
  legend: any|ApexLegend;
  fill: any|ApexFill;
};

export type ChartOptions = {
  plotOptions: any|ApexPlotOptions;
title:any|Title
options:any|ApexChart
  series: any|ApexNonAxisChartSeries;
  chart: any|ApexChart;
  responsive: any|ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {
  
  @ViewChild("chart") chart: any|ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public chartOptions2: Partial<ChartOptions2>;

  

  currentUser: any;
  contacts: any[]=[];
  constructor(
    private titleService: Title,
 ) {
this.chartOptions2 ={
  series: [
    {
     
      data: this.generateDayWiseTimeSeries(
        new Date().getTime(),
        20,
        {
          max:250,
         min:350

         
        }
      )
    }
  ],
  chart: {
    type: "area",
    width:300,
    height: 100,
    stacked: true,
    events: {
      selection: function(chart:any, e:any) {
      }
    }
  },
  colors: ["#008FFB", "#00E396", "#CED4DC"],
  dataLabels: {
    enabled: false
  },
  fill: {
    type: "gradient",
    gradient: {
      opacityFrom: 0.6,
      opacityTo: 0.8
    }
  },
  legend: {
    position: "top",
    horizontalAlign: "left"
  },
  xaxis: {
    type: "datetime"
  }
};

  this.chartOptions = {
  
      plotOptions:{
        Text:"hola",
labels:true
      },
    
    series: [50, 22, 32, 250, 22],
    chart: {
      type: "donut"
    },
    labels: ["Alfareros ", " Robledo", "Vallarta", "Punta Banda", "Aeropuerto"],
    
   
    responsive: [
      {
        breakpoint: 480,
        options: {
         
         
          chart: {
            width: 200
          },
          legend: {
            position: "bottom"
          }
        }
      }
    ],
    

  };


  }

  public generateDayWiseTimeSeries = function(baseval:any, count:any, yrange:any) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = baseval;
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push([x, y]);
      baseval += 86400000;
      i++;
    }
    return series;
  };
  ngOnInit() {
    this.titleService.setTitle('centinela - Inicio');
    
  }
}
