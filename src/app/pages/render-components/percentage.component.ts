import { Component, Input, OnInit } from "@angular/core";

import { ViewCell } from "ng2-smart-table";

@Component({
  template: `<ng-container *ngIf="isNumber">
      {{ value | percent: "1.3-5" }}
    </ng-container>
    <ng-container *ngIf="!isNumber"> {{ value }} </ng-container>`,
})
export class PercentageComponent implements ViewCell {
  private _value: number;
  public isNumber: boolean;

  @Input() set value(value: number) {
    this._value = value;
    this.isNumber = !isNaN(value);
  }

  get value() {
    return this._value;
  }
  @Input() rowData: any;
}
