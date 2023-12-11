import { CommonModule, formatNumber } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { NgxEchartsDirective } from 'ngx-echarts';
import { ECharts, EChartsOption, SeriesOption, getMap, registerMap } from 'echarts';
import { Subject, timer, zip } from 'rxjs';
import { groupBy, keys, maxBy } from 'lodash';

import { CountyModel, TownModel } from '../../models/county.model';
import { ALL, PARTY_COLOR_LIST } from '../../pages/dashboard/dashboard.page.component';
import { countyCenterMap, defaultCenter } from './county-center-map';

const COUNTY_MOI_MAP = 'COUNTY_MOI_MAP';

@Component({
  selector: 'app-map-chart',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    NgxEchartsDirective,
  ],
  templateUrl: './map-chart.component.html',
  styleUrl: './map-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapChartComponent implements OnInit, OnChanges, OnDestroy {

  @Input() year?: number;

  @Input() towns: TownModel[] | null = null;
  @Input() counties?: CountyModel[];
  @Input() selectedCounty: CountyModel | null = null;

  @Output() countyClick = new EventEmitter<string>();

  readonly basicOptions: EChartsOption;
  chartInstance?: ECharts;

  isLoading = true;
  showLoading = true;

  countySource: any;
  townSource: any;

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
    zip(this.http.get<any>('assets/data/COUNTY_MOI_1090820_sim2_ex.json'), this.http.get<any>('assets/data/TOWN_MOI_1120825_sim2_EX.json'))
      .subscribe(([COUNTY_MOI, TOWN_MOI]) => {
        registerMap(COUNTY_MOI_MAP, COUNTY_MOI);

        this.countySource = COUNTY_MOI;
        this.townSource = TOWN_MOI;

        const groupObj = groupBy(TOWN_MOI.features, item => item.properties['COUNTYNAME']);
        keys(groupObj).forEach(key => {
          this.checkAndRegisterCountyTownsMap(key);
        })
        this.isLoading = false;
        this.setCounties();

        timer(500).subscribe(() => {
          this.showLoading = false;
          this.cdr.detectChanges();
        });
      })
  }

  getSeriesDataOption(list: CountyModel[], selectedCountyName: string | null = null) {
    if (list?.length === 0) {
      return [];
    }

    const partyList = list[0]['候選人資料列表'].map(d => d['黨籍']);

    return list.map(county => {
      const isCountyLevel = !county['鄉(鎮、市、區)別'] || county['鄉(鎮、市、區)別'] === ALL;

      const maxParty = maxBy(county['候選人資料列表'], d => d.票數)!['黨籍']; // 該地區最高票
      const data: any = {
        name: isCountyLevel ? county['行政區別'] : county['鄉(鎮、市、區)別'],
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
          // 若選取某縣市時，其他縣市透明度降低
          opacity: (selectedCountyName && selectedCountyName !== county['行政區別']) ? 0.3 : 1
        },
        emphasis: {
          itemStyle: {
            areaColor: PARTY_COLOR_LIST.get(maxParty),
            opacity: 0.7,
          }
        },
      };

      // 針對部分縣市作微調
      const countyName = county['行政區別'];
      const townName = county['鄉(鎮、市、區)別'];
      if (countyName === '嘉義市' || countyName === '新竹市' || countyName === '臺北市') {
        data.label = {
          show: false
        }
      }
      if (countyName === '基隆市') {
        data.label = {
          offset: [16, -15],
          show: townName === ALL
        }
      }

      if (townName === ALL) {

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
  }

  getBasicSeriesOption(list: CountyModel[], selectedCountyName: string | null = null): SeriesOption {
    const basicSeriesOption: SeriesOption = {
      aspectScale: 0.9,
      scaleLimit: { min: 4, max: 20 },
      id: COUNTY_MOI_MAP,
      name: COUNTY_MOI_MAP,
      type: 'map',
      map: selectedCountyName ?? COUNTY_MOI_MAP,
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
      data: this.getSeriesDataOption(list, selectedCountyName),
      selectedMode: false
    };

    // 2012年桃園尚未升格直轄市，為避免名稱對不起來，此處先用映射方式處理
    if (this.year === 2012) {
      basicSeriesOption.nameMap = {
        '桃園市': '桃園縣',
      };
    }

    return basicSeriesOption;
  }

  setCounties() {
    if (!this.isLoading && this.chartInstance && this.counties?.length) {
      const series = this.getBasicSeriesOption(this.counties);

      this.chartInstance!.setOption({
        ...this.basicOptions,
        tooltip: {
          formatter: (params: any) => {
            if (!params.data) {
              return '';
            };

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
    let selectedCountyName: string | null = this.selectedCounty!['行政區別'];
    if (selectedCountyName === ALL) {
      selectedCountyName = null;
    }

    if (selectedCountyName) {
      this.checkAndRegisterCountyTownsMap(selectedCountyName);
    }

    const { center, zoom } = countyCenterMap.get(this.selectedCounty!['行政區別']) ?? defaultCenter;

    const list = [...this.counties!];
    if (selectedCountyName) {
      list.push(...this.towns!);
    }

    const basicSeries = this.getBasicSeriesOption(list, selectedCountyName);

    this.chartInstance?.setOption({
      series: {
        ...basicSeries,
        center,
        zoom,
      }
    });
  }

  checkAndRegisterCountyTownsMap(countyName: string) {
    if (countyName && !getMap(countyName)) {
      const a = this.countySource.features.filter((item: any) => item.properties['COUNTYNAME'] !== countyName);
      const b = this.townSource.features.filter((item: any) => item.properties['COUNTYNAME'] === countyName);
      registerMap(countyName, { type: 'FeatureCollection', features: [...a, ...b] });
    }
  }

  onChartInit(e: ECharts) {
    this.chartInstance = e;
    this.queryAndSetSeries();
  }
}
