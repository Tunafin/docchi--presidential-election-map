import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-share-toolbox',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
  <span class="share-text">分享</span>

  <button mat-icon-button>
    <mat-icon svgIcon="facebook"></mat-icon>
  </button>

  <button mat-icon-button>
    <mat-icon svgIcon="instagram"></mat-icon>
  </button>

  <button mat-icon-button>
    <mat-icon svgIcon="youtube"></mat-icon>
  </button>`,
  styleUrl: './share-toolbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShareToolboxComponent { }
