import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnDestroy } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Subject, takeUntil } from 'rxjs';

import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-start.page',
  standalone: true,
  imports: [
    CommonModule,
    MatRippleModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './start.page.component.html',
  styleUrl: './start.page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartPageComponent implements OnDestroy {

  @HostBinding('class.mobile')
  isMobile = false;

  someField: boolean = false;

  readonly yearDisabledList = [1996, 2000, 2004, 2008];
  readonly yearList = [2012, 2016, 2020];

  private readonly _destroyed = new Subject<void>();

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver,
    private loadingService: LoadingService,
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

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  onYearChipClick(year: number) {
    // 儀錶板頁面的組件已有讀取動畫，故此處先不顯示全螢幕 loading 畫面
    // this.loadingService.openLoading();

      this.router.navigate(['dashboard', year]).then(() => {
        this.loadingService.closeLoading();
      })
  }
}
