import { Component, OnDestroy, OnInit } from "@angular/core";
import { NbJSThemeVariable, NbThemeService } from "@nebular/theme";
import { Subject } from "rxjs";
import { filter, map, takeUntil, tap } from "rxjs/operators";
import { OrderEntriesFacade } from "../../../store/order-entries.facade";

@Component({
  selector: "pnl-chart",
  template: `
    <ngx-charts-area-chart
      (window:resize)="onResize($event)"
      [view]="view"
      [scheme]="colorScheme"
      [results]="data$ | async"
      [xAxis]="showXAxis"
      [yAxis]="showYAxis"
      [legend]="showLegend"
      [showXAxisLabel]="showXAxisLabel"
      [showYAxisLabel]="showYAxisLabel"
      [xAxisLabel]="xAxisLabel"
      [yAxisLabel]="yAxisLabel"
      [autoScale]="autoScale"
      [gradient]="true"
    >
    </ngx-charts-area-chart>
  `,
})
export class PnLChartComponent implements OnInit, OnDestroy {
  view;
  showLegend = false;
  autoScale = true;
  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  xAxisLabel = "Date";
  yAxisLabel = "PnL in $";
  colorScheme: any;
  themeSubscription: any;

  public data$ = this.service.getPnLChartDataPoints(24);
  private destroy$ = new Subject<void>();
  constructor(
    private service: OrderEntriesFacade,
    private theme: NbThemeService
  ) {
    this.view = [700, null];
  }

  public onResize(event) {
    this.view = [700, null];
  }

  ngOnInit(): void {
    this.theme
      .getJsTheme()
      .pipe(takeUntil(this.destroy$))
      .subscribe((config) => {
        const colors: NbJSThemeVariable = config.variables;
        this.colorScheme = {
          domain: ["#56EBAF", "#FF8DA4", "#68BBFF"],
        };
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
