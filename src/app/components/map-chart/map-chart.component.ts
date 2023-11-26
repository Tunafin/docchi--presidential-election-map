import { CommonModule, formatNumber } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { NgxEchartsDirective } from 'ngx-echarts';
import { ECElementEvent, ECharts, EChartsOption, SeriesOption, registerMap } from 'echarts';
import { Subject, zip } from 'rxjs';
import { maxBy } from 'lodash';

import { CountyModel } from '../../models/county.model';
import { PARTY_COLOR_LIST } from '../../pages/dashboard/dashboard.page.component';

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
export class MapChartComponent implements OnInit, OnDestroy {

  @Input() year?: number;

  @Input()
  public set counties(value: CountyModel[] | undefined) {
    this._counties = value;
    this.setCounties();
  }
  public get counties(): CountyModel[] | undefined { return this._counties; }
  private _counties?: CountyModel[] | undefined;

  readonly basicOptions: EChartsOption;
  chartInstance?: ECharts;

  isLoading = true;

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

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  queryAndSetSeries() {
    zip(this.http.get<any>('assets/data/COUNTY_MOI_1090820_sim2_ex.json')).subscribe(([COUNTY_MOI]) => {

      registerMap(COUNTY_MOI_MAP, COUNTY_MOI);
      this.isLoading = false;
      this.setCounties();
      this.chartInstance?.hideLoading();
      this.cdr.detectChanges();
    })
  }

  setCounties() {
    if (!this.isLoading && this.chartInstance && this.counties?.length) {
      const partyList = this.counties[0]['候選人資料列表'].map(d => d['黨籍']);

      const seriesData = this.counties!.map(county => {
        const maxParty = maxBy(county['候選人資料列表'], d => d.票數)!['黨籍']; // 該地區最高票
        return {
          name: county['行政區別'],
          value: [
            partyList.map(partyName => {
              return {
                party: partyName,
                voteCount: county['候選人資料列表'].find(d => d['黨籍'] === partyName)!['票數']
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
          }
        }
      });

      const basicSeriesOption: SeriesOption = {
        aspectScale: 0.9,
        scaleLimit: { min: 3, max: 10 },
        // id: COUNTY_MOI_MAP,
        // name: COUNTY_MOI_MAP,
        type: 'map',
        map: COUNTY_MOI_MAP,
        roam: true,
        center: [120.7, 23.8],
        zoom: 4,
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: false,
          }
        },
        selectedMode: false
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
            const valueList = params.data.value[0] as { party: string, voteCount: number }[];
            let text = `<span style="font-size: 20px; font-weight: bold">${params.name}</span><br/>`;
            valueList.forEach(value => {
              text += `
                  <span style="display: inline-block; width: 80px;">${value.party}: </span>
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

  onChartInit(e: ECharts) {
    this.chartInstance = e;
    this.chartInstance.showLoading();
    this.cdr.detectChanges();

    this.queryAndSetSeries();
  }

  onChartClick(event: ECElementEvent) {
    const countyName = event.name;

    // TODO
  }
}
