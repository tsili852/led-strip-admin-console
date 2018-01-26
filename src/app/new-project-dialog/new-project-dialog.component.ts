import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    templateUrl: './new-project-dialog.html'
  })
  export class NewProjectDialogComponent {
    constructor(
      public dialogRef: MatDialogRef<NewProjectDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) { }

    onCancelClick(): void {
      this.dialogRef.close();
    }
  }
