import { Component, Input, OnInit } from "@angular/core";

import { ViewCell } from "ng2-smart-table";

@Component({
  template: ` {{ value | currency }} `,
})
export class CurrencyComponent implements ViewCell {
  @Input() value: string | number;
  @Input() rowData: any;
}
