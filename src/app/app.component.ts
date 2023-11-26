import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'docchi--presidential-election-map';

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {

    // 註冊自定義的 svg 圖示
    ['facebook', 'instagram', 'youtube', 'check_circle'].forEach(iconName => {
      iconRegistry.addSvgIcon(iconName, sanitizer.bypassSecurityTrustResourceUrl(`assets/images/${iconName}.svg`));
    });
  }
}
