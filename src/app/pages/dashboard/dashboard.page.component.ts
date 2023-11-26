import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { Subject, takeUntil, zip } from 'rxjs';

import { ShareToolboxComponent } from '../../components/share-toolbox/share-toolbox.component';
import { MapChartComponent } from '../../components/map-chart/map-chart.component';
import { CountyModel } from './../../models/county.model';

export const PARTY_COLOR_LIST = new Map<string, string>();
PARTY_COLOR_LIST.set('中國國民黨', '#7f82ff');
PARTY_COLOR_LIST.set('民主進步黨', '#57d2a9');
PARTY_COLOR_LIST.set('親民黨', '	#f4a76f');

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
  ],
  templateUrl: './dashboard.page.component.html',
  styleUrl: './dashboard.page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements OnInit, OnDestroy {

  selectedYear = 2020;

  counties?: CountyModel[];

  selectedCounty: string = ALL;

  isMobile = false;

  readonly yearDisabledList = [1996, 2000, 2004, 2008];
  readonly yearList = [2012, 2016, 2020];

  private readonly _destroyed = new Subject<void>();

  constructor(
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
  }

  ngOnInit(): void {
    this.queryData();
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  queryData() {
    zip(this.http.get<any>('assets/data/2020.json')).subscribe(([county2020]) => {
      this.counties = county2020;
      this.cdr.detectChanges();
    })
  }

  onSelectWrapperClick(select: MatSelect) {
    if (!select.panelOpen) {
      select.open();
    }
  }
}
