import { Component, OnDestroy } from "@angular/core";
import { NbJSThemeVariable, NbThemeService } from "@nebular/theme";
import { Observable } from "rxjs";
import { OrderEntriesFacade } from "../../../store/order-entries.facade";

@Component({
  selector: "long-short",
  template: `
    <ngx-charts-pie-chart
      [results]="results$ | async"
      [legend]="showLegend"
      [labels]="showLabels"
      [customColors]="customColors"
    >
    </ngx-charts-pie-chart>
  `,
})
export class LongShortComponent {
  results$: Observable<{ name: string; value: number }[]>;
  showLegend = false;
  showLabels = true;
  colorScheme: any;
  themeSubscription: any;

  customColors = [
    {
      name: "LONG",
      value: "#56EBAF",
    },
    {
      name: "SHORT",
      value: "#FF8DA4",
    },
  ];

  constructor(private orderEntriesFacade: OrderEntriesFacade) {
    this.results$ = this.orderEntriesFacade.getLongShortProfit(24);
  }
}
