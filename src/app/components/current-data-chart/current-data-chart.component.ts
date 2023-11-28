import { CommonModule, formatNumber } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { NgxEchartsDirective } from 'ngx-echarts';
import { ECharts, EChartsOption, SeriesOption } from 'echarts';
import { Subject, takeUntil } from 'rxjs';
import { sumBy } from 'lodash';

import { CountyModel, TownModel } from '../../models/county.model';
import { PARTY_AVATOR_LIST, PARTY_COLOR_LIST } from '../../pages/dashboard/dashboard.page.component';

@Component({
  selector: 'app-current-data-chart',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    NgxEchartsDirective,
  ],
  templateUrl: './current-data-chart.component.html',
  styleUrl: './current-data-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentDataChartComponent implements OnInit, OnChanges, OnDestroy {

  @Input() townOrCounty: TownModel | CountyModel | null = null;

  get townName() {
    const tempTownName =(this.townOrCounty as TownModel)['鄉(鎮、市、區)別'];
    if(tempTownName && tempTownName !== '全部') {
      return tempTownName;
    }
    return null;
  }

  readonly basicPieOptions: EChartsOption;

  chartInstance?: ECharts;

  isMobile = false;
  isLoading = true;

  readonly PARTY_COLOR_LIST = PARTY_COLOR_LIST;
  readonly PARTY_AVATOR_LIST = PARTY_AVATOR_LIST;

  private readonly _destroyed = new Subject<void>();

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.breakpointObserver
      .observe([
        '(max-width: 1400px)',
      ])
      .pipe(takeUntil(this._destroyed))
      .subscribe(result => {
        this.isMobile = result.matches;
        this.cdr.markForCheck();
      });

    this.basicPieOptions = {
      tooltip: {
        position: 'right',
        formatter: ((params: any) => {
          let proportion = '??';
          let text = `${params.marker} ${params.name}<br/>`;

          if (this.townOrCounty) {
            if (!params.name.startsWith('未投票')) {
              text += '得票率:' + formatNumber(params.data.value / sumBy(this.townOrCounty['候選人資料列表'], d => d['票數']) * 100, 'en', '.2-2') + '% <br>';
            }
            // text += formatNumber(params.data.value / this.county['選舉人數'] * 100, 'en', '.2-2') + '% (所有占比)<br>';
          }

          return text;
        }) as any
      }
    };
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes) {
      this.setSeries();
    }
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  onChartInit(e: ECharts) {
    this.chartInstance = e;
    this.isLoading = false;
    this.setSeries();
  }

  setSeries() {
    if (!this.isLoading && this.chartInstance && this.townOrCounty) {
      const seriesData: any[] = this.townOrCounty['候選人資料列表'].map(d => ({
        name: d['黨籍'],
        value: d['票數'],
        itemStyle: {
          color: PARTY_COLOR_LIST.get(d['黨籍']),
          opacity: 1
        },
      }));
      seriesData.push({
        name: '未投票 & 無效票',
        value: this.townOrCounty['選舉人數'] - sumBy(this.townOrCounty['候選人資料列表'], d => d['票數']),
        itemStyle: {
          color: '#000',
          opacity: 0.035
        },
        emphasis: {
          itemStyle: {
            opacity: 0.1
          }
        }
      })

      const series: SeriesOption = {
        type: 'pie',
        radius: ['50%', '90%'],
        labelLine: {
          show: false
        },
        label: {
          show: false
        },
        data: seriesData
      }

      setTimeout(() => {
        this.chartInstance!.setOption({
          ...this.basicPieOptions,
          series
        }, true);
      }, 100);
    }
  }
}
