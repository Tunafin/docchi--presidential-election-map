import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { NgxEchartsDirective } from 'ngx-echarts';
import { ECharts, EChartsOption } from 'echarts';
import { Subject } from 'rxjs';
import { random } from 'lodash';

import { PartyHistoryModel, getDefaultPartyHistoryModelList } from '../../models/party-history.model';
import { PARTY_COLOR_LIST } from '../../pages/dashboard/dashboard.page.component';

@Component({
  selector: 'app-history-data-chart',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    NgxEchartsDirective,
  ],
  templateUrl: './history-data-chart.component.html',
  styleUrl: './history-data-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryDataChartComponent implements OnInit, OnChanges, OnDestroy {

  partyHistoryList?: PartyHistoryModel[];

  readonly basicBarOptions: EChartsOption;
  readonly basicLineOptions: EChartsOption;

  readonly displayYears = [1996, 2000, 2004, 2008, 2012, 2016, 2020];

  chartBarInstance?: ECharts;
  chartLineInstance?: ECharts;

  private readonly _destroyed = new Subject<void>();

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.basicBarOptions = this.getBasicBarOptions();
    this.basicLineOptions = this.getBasicLineOptions();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.partyHistoryList = getDefaultPartyHistoryModelList();
      this.setBarSeries();
      this.setLineSeries();
    }, random(500, 2000));
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  onBarChartInit(e: ECharts) {
    this.chartBarInstance = e;
  }

  onLineChartInit(e: ECharts) {
    this.chartLineInstance = e;
  }

  getBasicBarOptions(): EChartsOption {
    return {
      grid: {
        left: 10,
        right: 10,
        bottom: 10,
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {},
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: this.displayYears
        }
      ],
      yAxis: [
        {
          type: 'value',
          max: 9870000,
          axisLabel: {
            formatter: (value: number) => `${value / 10000}萬`
          }
        }
      ],
    };
  }

  getBasicLineOptions(): EChartsOption {
    return {
      grid: {
        left: 10,
        right: 10,
        bottom: 10,
        containLabel: true
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {},
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: this.displayYears
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            formatter: '{value}%'
          }
        }
      ],
    };
  }

  setBarSeries() {
    if (this.chartBarInstance && this.partyHistoryList) {
      const seriesList = this.partyHistoryList.map(p => {
        return {
          type: 'bar',
          barCategoryGap: 20,
          name: p.party,
          emphasis: {
            focus: 'series'
          },
          color: PARTY_COLOR_LIST.get(p.party) ?? '#9d9d9d',
          data: this.displayYears.map(y => {
            return p.data.find(d => d.year == y)?.value ?? null
          })
        }
      });

      this.chartBarInstance!.setOption({
        ...this.basicBarOptions,
        series: seriesList
      }, true);

      this.cdr.detectChanges();
    }
  }

  setLineSeries() {
    if (this.chartBarInstance && this.partyHistoryList) {
      const seriesList = this.partyHistoryList.map(p => {
        return {
          type: 'line',
          name: p.party,
          emphasis: {
            focus: 'series'
          },
          color: PARTY_COLOR_LIST.get(p.party) ?? '#9d9d9d',
          symbolSize: 6,
          data: this.displayYears.map(y => {
            return p.data.find(d => d.year == y)?.percentage ?? null
          })
        }
      });

      this.chartLineInstance!.setOption({
        ...this.basicLineOptions,
        series: seriesList
      }, true);

      this.cdr.detectChanges();
    }
  }
}
