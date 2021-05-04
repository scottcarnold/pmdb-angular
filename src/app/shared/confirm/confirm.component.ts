import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {

  confirmQuestion: string = 'Are you sure you wish to proceed?';
  action: string = 'Action';

  constructor(private dialogRef: MatDialogRef<ConfirmComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data && data.confirmQuestion) {
      this.confirmQuestion = data.confirmQuestion;
    }
    if (data && data.action) {
      this.action = data.action;
    }
  }

  ngOnInit(): void {
  }

  cancel() {
    this.dialogRef.close();
  }

  confirm() {
    this.dialogRef.close(true);
  }
}
