import { Component, Input, OnInit } from "@angular/core";

import { ViewCell } from "ng2-smart-table";

@Component({
  template: ` {{ value | percent: "1.3-5" }} `,
})
export class PercentageComponent implements ViewCell {
  @Input() value: string | number;
  @Input() rowData: any;
}
