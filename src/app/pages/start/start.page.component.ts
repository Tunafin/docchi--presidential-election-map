import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Subject, takeUntil } from 'rxjs';

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

  isMobile = false;

  readonly yearDisabledList = [1996, 2000, 2004, 2008];
  readonly yearList = [2012, 2016, 2020];

  private readonly _destroyed = new Subject<void>();

  constructor(
    private router: Router,
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

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  onYearChipClick(year: number) {
    this.router.navigate(['dashboard', year]);
  }
}
