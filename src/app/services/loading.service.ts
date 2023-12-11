import { Component, Injectable } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private dialogRef: MatDialogRef<LoadingDialog> | null = null;

  constructor(private dialog: MatDialog) { }

  openLoading() {
    this.dialogRef = this.dialog.open(LoadingDialog, {
      disableClose: true,
      panelClass: 'transparent-panel'
    });
  }

  closeLoading() {
    if (this.dialogRef != null) {
      this.dialogRef.close();
      this.dialogRef = null;
    }
  }
}

@Component({
  selector: 'loading-dialog',
  template: `<mat-spinner color="accent"></mat-spinner>`,
  standalone: true,
  imports: [MatProgressSpinnerModule],
})
class LoadingDialog {
  constructor() { }
}
