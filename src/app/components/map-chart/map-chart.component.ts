import { CommonModule, formatNumber } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { NgxEchartsDirective } from 'ngx-echarts';
import { ECharts, EChartsOption, SeriesOption, registerMap } from 'echarts';
import { Subject, timer, zip } from 'rxjs';
import { maxBy } from 'lodash';

import { CountyModel } from '../../models/county.model';
import { PARTY_COLOR_LIST } from '../../pages/dashboard/dashboard.page.component';
import { countyCenterMap, defaultCenter } from './county-center-map';

const COUNTY_MOI_MAP = 'COUNTY_MOI_MAP';

@Component({
  selector: 'app-map-chart',
  standalone: true,
  imports: [
    CommonModule,
    NgxEchartsDirective,
  ],
  templateUrl: './map-chart.component.html',
  styleUrl: './map-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapChartComponent implements OnInit, OnChanges, OnDestroy {

  @Input() year?: number;

  @Input() counties?: CountyModel[];
  @Input() selectedCounty?: CountyModel;

  @Output() countyClick = new EventEmitter<string>();

  readonly basicOptions: EChartsOption;
  chartInstance?: ECharts;

  isLoading = true;
  showLoading = true;

  private readonly _destroyed = new Subject<void>();

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {
    this.basicOptions = {
      tooltip: {}
    }
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['year'] || changes['counties']) {
      this.setCounties();
    } else if (changes['selectedCounty']) {
      this.moveToCounty();
    }
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  queryAndSetSeries() {
    zip(this.http.get<any>('assets/data/COUNTY_MOI_1090820_sim2_ex.json')).subscribe(([COUNTY_MOI]) => {
      registerMap(COUNTY_MOI_MAP, COUNTY_MOI);
      this.isLoading = false;
      this.setCounties();

      timer(500).subscribe(() => {
        this.showLoading = false;
        this.cdr.detectChanges();
      });
    })
  }

  setCounties() {
    if (!this.isLoading && this.chartInstance && this.counties?.length) {
      const partyList = this.counties[0]['候選人資料列表'].map(d => d['黨籍']);

      const seriesData = this.counties!.map(county => {
        const maxParty = maxBy(county['候選人資料列表'], d => d.票數)!['黨籍']; // 該地區最高票
        const data: any = {
          name: county['行政區別'],
          value: [
            partyList.map(partyName => {
              const d = county['候選人資料列表'].find(d => d['黨籍'] === partyName);
              return {
                party: partyName,
                candidate: d!['候選人組合'][0],
                voteCount: d!['票數']
              };
            }),
            maxParty
          ],
          itemStyle: {
            areaColor: PARTY_COLOR_LIST.get(maxParty),
            color: PARTY_COLOR_LIST.get(maxParty),
            opacity: 1
          },
          emphasis: {
            itemStyle: {
              areaColor: PARTY_COLOR_LIST.get(maxParty),
              opacity: 0.7,
            }
          },
        };

        // 針對部分縣市作微調
        {
          const countyName = county['行政區別'];
          if (countyName === '嘉義市' || countyName === '新竹市' || countyName === '臺北市') {
            data.label = {
              show: false
            }
          }
          if (countyName === '基隆市') {
            data.label = {
              offset: [16, -15]
            }
          }
          if (countyName === '新北市') {
            data.label = {
              offset: [8, 18]
            }
          }
          if (countyName === '澎湖縣' || countyName === '金門縣' || countyName === '連江縣') {
            data.label = {
              offset: [20, 20],
            }
          }
        }

        return data;
      });

      const basicSeriesOption: SeriesOption = {
        aspectScale: 0.9,
        scaleLimit: { min: 4, max: 12 },
        id: COUNTY_MOI_MAP,
        name: COUNTY_MOI_MAP,
        type: 'map',
        map: COUNTY_MOI_MAP,
        roam: true,
        center: defaultCenter.center,
        zoom: defaultCenter.zoom,
        label: {
          show: true,
          textBorderType: 'solid',
          textBorderWidth: 2.5,
          textBorderColor: '#334155',
          color: '#fff',
          formatter: (params: any) => params.name.slice(0, 2)
        },
        emphasis: {
          label: {
            textBorderType: 'solid',
            textBorderWidth: 1,
            color: '#fff',
          }
        },
        selectedMode: false
      }

      // 2012年桃園尚未升格直轄市，為避免名稱對不起來，此處先用映射方式處理
      if (this.year === 2012) {
        basicSeriesOption.nameMap = {
          '桃園市': '桃園縣',
        };
      }

      const series = ({
        ...basicSeriesOption,
        name: 'Data of all counties',
        data: seriesData
      });

      this.chartInstance!.setOption({
        ...this.basicOptions,
        tooltip: {
          formatter: (params: any) => {
            const valueList = params.data.value[0] as { party: string, candidate: string, voteCount: number }[];
            let text = `<span style="font-size: 20px; font-weight: bold">${params.name}</span><br/>`;
            valueList.forEach(value => {
              text += `
                    <span style="display: inline-block; width: 60px;">${value.candidate}： </span>
                    <span style="display: inline-block; width: 60px; text-align: end">${formatNumber(value.voteCount, 'en')}</span>
                    <br/>`
            })
            return text;
          },
        },
        series: [series]
      }, true);

      this.cdr.detectChanges();
    }
  }

  moveToCounty() {
    const { center, zoom } = countyCenterMap.get(this.selectedCounty!['行政區別']) ?? defaultCenter;

    this.chartInstance?.setOption({
      series: {
        id: COUNTY_MOI_MAP,
        roam: true,
        center,
        zoom,
      }
    });
  }

  onChartInit(e: ECharts) {
    this.chartInstance = e;
    this.queryAndSetSeries();
  }
}
