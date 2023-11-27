import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatTableModule } from '@angular/material/table';

import { Subject } from 'rxjs';
import { sumBy } from 'lodash';

import { CountyModel } from '../../models/county.model';
import { PARTY_AVATOR_LIST } from '../../pages/dashboard/dashboard.page.component';

interface TableElement {
  '地區': string,
  '得票率': number,
  '最高票政黨': string,
  '最高票候選人': string,
  '投票數': number,
  '投票率': number,
}

@Component({
  selector: 'app-area-data-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule
  ],
  templateUrl: './area-data-table.component.html',
  styleUrl: './area-data-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreaDataTableComponent implements OnInit, OnChanges, OnDestroy {

  displayedColumns: string[] = ['地區', '得票率', '最高票候選人', '投票數', '投票率'];
  dataSource?: TableElement[];

  @Input() counties?: CountyModel[];

  readonly PARTY_AVATOR_LIST = PARTY_AVATOR_LIST;

  private readonly _destroyed = new Subject<void>();

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver,
  ) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.setDataSource();
    }
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  setDataSource() {
    this.dataSource = this.counties?.map(county => {
      const elected = county['候選人資料列表'].find(d => d['黨籍'] == county['當選政黨'])!;
      const sum = sumBy(county['候選人資料列表'], d => d['票數']);

      const element: TableElement = {
        '地區': county['行政區別'],
        '得票率': elected['票數'] / sum * 100,
        '最高票政黨': elected['黨籍'],
        '最高票候選人': elected['候選人組合'][0],
        '投票數': county['投票數'],
        '投票率': county['投票率']
      }

      return element;
    })
  }
}
