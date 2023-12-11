import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';

import { Subject, takeUntil, zip } from 'rxjs';

import { CountyModel, TownModel } from './../../models/county.model';
import { ShareToolboxComponent } from '../../components/share-toolbox/share-toolbox.component';
import { MapChartComponent } from '../../components/map-chart/map-chart.component';
import { CurrentDataChartComponent } from '../../components/current-data-chart/current-data-chart.component';
import { HistoryDataChartComponent } from '../../components/history-data-chart/history-data-chart.component';
import { AreaDataTableComponent } from '../../components/area-data-table/area-data-table.component';

export const PARTY_COLOR_LIST = new Map<string, string>();
PARTY_COLOR_LIST.set('中國國民黨', '#7f82ff');
PARTY_COLOR_LIST.set('民主進步黨', '#57d2a9');
PARTY_COLOR_LIST.set('親民黨', '#f4a76f');
PARTY_COLOR_LIST.set('無黨籍及未經政黨推薦', '#9d9d9d');

export const PARTY_AVATOR_LIST = new Map<string, string>();
PARTY_AVATOR_LIST.set('中國國民黨', 'assets/images/avatar_blue.png');
PARTY_AVATOR_LIST.set('民主進步黨', 'assets/images/avatar_green.png');
PARTY_AVATOR_LIST.set('親民黨', 'assets/images/avatar_orange.png');
PARTY_AVATOR_LIST.set('無黨籍及未經政黨推薦', 'assets/images/avatar_orange.png');

export const ALL = '全部';

@Component({
  selector: 'app-dashboard.page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatRippleModule,
    MatButtonModule,
    MatTooltipModule,
    MatToolbarModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDividerModule,

    ShareToolboxComponent,
    MapChartComponent,
    CurrentDataChartComponent,
    HistoryDataChartComponent,
    AreaDataTableComponent,
  ],
  templateUrl: './dashboard.page.component.html',
  styleUrl: './dashboard.page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements OnInit, OnDestroy {

  selectedYear: number;

  // 目前選取的鄉鎮縣市
  selectedTown: TownModel | null = null;

  // 目前選取的縣市
  private _selectedCounty: CountyModel | null = null;
  public get selectedCounty(): CountyModel | null { return this._selectedCounty; }
  public set selectedCounty(value: CountyModel | null) {
    this._selectedCounty = value;

    this._selectedCountyTowns = value && value['行政區別'] !== ALL && this.yearTownsPairMap
      .get(this.selectedYear)?.filter(town => town['行政區別'] === value['行政區別']) || null;
  }
  private _selectedCountyTowns: TownModel[] | null = null;
  public get selectedCountyTowns(): TownModel[] | null { return this._selectedCountyTowns; }

  counties?: CountyModel[]; // 存放當前選取年的縣市資料，並給子元件用
  readonly yearCountiesPairMap = new Map<number, CountyModel[]>(); // 存放各年的縣市資料
  readonly yearTownsPairMap = new Map<number, TownModel[]>(); // 存放各年的鄉鎮市區資料

  isMobile = false;

  readonly yearDisabledList = [1996, 2000, 2004, 2008];
  readonly yearList = [2012, 2016, 2020];

  private readonly _destroyed = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.breakpointObserver
      .observe([
        '(max-width: 1024px)',
      ])
      .pipe(takeUntil(this._destroyed))
      .subscribe(result => {
        this.isMobile = result.matches;
        this.cdr.markForCheck();
      });

    // 設定初始選擇年份
    let year = coerceNumberProperty(this.route.snapshot.paramMap.get('year'), 2020);
    if (!this.yearList.includes(year)) {
      year = 2020;
    }
    this.selectedYear = year;
  }

  ngOnInit(): void {
    this.queryData();
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  queryData() {
    const observableList = this.yearList.map(year => this.http.get<any>(`assets/data/towns_${year}.json`));
    zip(observableList).subscribe((resList) => {
      resList.forEach((res: TownModel[], index) => {
        const conuties = res.filter(r => r['鄉(鎮、市、區)別'] === ALL);

        this.yearCountiesPairMap.set(this.yearList[index], conuties);
        this.yearTownsPairMap.set(this.yearList[index], res);
      });
      this.onSelectedYearChange(this.selectedYear);
    })
  }

  onSelectedYearChange(year: number) {
    this.router.navigate(['..', year], { relativeTo: this.route, replaceUrl: true });
    this.counties = this.yearCountiesPairMap.get(this.selectedYear)!;
    this.selectCounty(this.counties[0]);
  }

  onSelectedCountyChange(county: CountyModel) {
    this.selectCounty(county);
  }

  onSelectedTownChange(town: TownModel) {
    this.selectTown(town);
  }

  onMapCountyClick(countyName: string) {
    const county = this.counties!.find(c => c['行政區別'] === countyName) ?? null;

    if (county) {
      this.selectCounty(county);
      return;
    }

    const town = this.selectedCountyTowns?.find(c => c['鄉(鎮、市、區)別'] === countyName) ?? null;
    if (town) {
      this.selectTown(town);
      return;
    }
  }

  // 選取縣市
  selectCounty(county: CountyModel | null) {
    if (this.selectedCounty !== county) {
      this.selectedCounty = county;
      this.selectedTown = null;
      this.cdr.detectChanges();
    }
  }

  // 選取鄉鎮縣市
  selectTown(town: TownModel) {
    this.selectedTown = town;
    this.cdr.detectChanges();
  }

  backToStartPage() {
    this.router.navigate(['/']);
  }
}
