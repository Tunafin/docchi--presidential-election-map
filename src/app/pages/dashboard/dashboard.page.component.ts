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
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { Subject, takeUntil, zip } from 'rxjs';

import { CountyModel } from './../../models/county.model';
import { ShareToolboxComponent } from '../../components/share-toolbox/share-toolbox.component';
import { MapChartComponent } from '../../components/map-chart/map-chart.component';
import { CurrentDataChartComponent } from '../../components/current-data-chart/current-data-chart.component';
import { HistoryDataChartComponent } from '../../components/history-data-chart/history-data-chart.component';

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

const ALL = '全部';

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

    ShareToolboxComponent,
    MapChartComponent,
    CurrentDataChartComponent,
    HistoryDataChartComponent,
  ],
  templateUrl: './dashboard.page.component.html',
  styleUrl: './dashboard.page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements OnInit, OnDestroy {

  selectedYear: number;

  counties?: CountyModel[]; // 存放當前選取年的縣市資料，並給子元件用
  readonly queriedList = new Map<number, CountyModel[]>(); // 存放所有年的縣市資料

  selectedCounty: string = ALL;

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
    const observableList = this.yearList.map(year => this.http.get<any>(`assets/data/${year}.json`));
    zip(observableList).subscribe((resList) => {
      resList.forEach((res, index) => {
        this.queriedList.set(this.yearList[index], res);
      });
      this.counties = this.queriedList.get(this.selectedYear);
      this.cdr.detectChanges();
    })
  }

  onSelectWrapperClick(select: MatSelect) {
    if (!select.panelOpen) {
      select.open();
    }
  }

  onSelectedYearChange(year: number) {
    this.router.navigate(['..', year], { relativeTo: this.route, replaceUrl: true });
    this.counties = this.queriedList.get(this.selectedYear);
    this.cdr.detectChanges();
  }
}
