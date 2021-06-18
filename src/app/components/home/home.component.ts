import { Component, OnInit } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  totalConfirmed = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  totalActive = 0;
  globalData: GlobalDataSummary[];
  pieChart: GoogleChartInterface = {
    chartType: 'PieChart'
  }
  columnChart: GoogleChartInterface = {
    chartType: 'ColumnChart'
  }
  constructor(private dataService: DataServiceService) { }

  initChart(caseType: string) {

    let datatable = [];
    datatable.push(["Country", "Cases"])
    this.globalData.forEach(cs => {
      let value:number;
      if (caseType=='a'){
        if (cs.active >1000000)
          value=cs.active
      }else if (caseType=='c'){
        if (cs.confirmed >1000000)
          value=cs.confirmed
      }else if (caseType=='d'){
        if (cs.deaths >100000)
          value=cs.deaths
      }else if (caseType=='r'){
        if (cs.recovered >10000)
          value=cs.recovered
      }
datatable.push([
  cs.country,value
])
      // if (cs.confirmed > 1000000) {
      //   if (caseType == 'c') {
      //     datatable.push([cs.country, cs.confirmed])
      //   } else if (caseType == 'd') {
      //     datatable.push([cs.country, cs.deaths])
      //   } else if (caseType == 'r') {
      //     datatable.push([cs.country, cs.recovered])
      //   } else if (caseType == 'a') {
      //     datatable.push([cs.country, cs.active])
      //   }
      // }
    })

    this.pieChart = {
      chartType: 'PieChart',
      dataTable: datatable,
      options: { height: 370 },
    };
    this.columnChart = {
      chartType: 'ColumnChart',
      dataTable: datatable,
      options: { height: 380 },
    };
  }

  ngOnInit(): void {

    this.dataService.getGlobalData()
      .subscribe(
        {
          next: (result) => {
            // console.log(result);
            this.globalData = result;
            result.forEach(cs => {
              if (!Number.isNaN(cs.confirmed)) {
                this.totalConfirmed += cs.confirmed;
                this.totalActive += cs.active;
                this.totalDeaths += cs.deaths;
                this.totalRecovered += cs.recovered;
              }

            })

            this.initChart('c');
          }
        }
      )
  }

  updateChart(input: string) {
    console.log(input);
    this.initChart(input);
  }

}
