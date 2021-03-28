import { Component, OnDestroy, OnInit } from "@angular/core";
import { NbJSThemeVariable, NbThemeService } from "@nebular/theme";
import { Subject } from "rxjs";
import { map, takeUntil, tap } from "rxjs/operators";
import { OrderEntriesFacade } from "../../store/order-entries.facade";

@Component({
  selector: "ngx-d3-pnl-area-chart",
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
export class D3AreaStackComponent implements OnInit, OnDestroy {
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

  public data$ = this.service.getPnLChartDataPoints();

  private destroy$ = new Subject<void>();
  constructor(
    private service: OrderEntriesFacade,
    private theme: NbThemeService
  ) {
    this.view = [1500, 646];
  }

  public onResize(event) {
    this.view = [1500, 646];
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
