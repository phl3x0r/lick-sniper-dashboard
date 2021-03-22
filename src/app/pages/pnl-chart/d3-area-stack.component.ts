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

  public data$ = this.service.getPnLChartDataPoints().pipe(
    map((datapoints) => [
      {
        name: "PnL",
        series: datapoints,
      },
    ]),
    tap(console.log)
  );
  private destroy$ = new Subject<void>();
  constructor(
    private service: OrderEntriesFacade,
    private theme: NbThemeService
  ) {
    this.view = [innerWidth / 1.3, 646];
  }

  public onResize(event) {
    this.view = [event.target.innerWidth / 1.35, 646];
  }

  ngOnInit(): void {
    this.theme
      .getJsTheme()
      .pipe(takeUntil(this.destroy$))
      .subscribe((config) => {
        const colors: NbJSThemeVariable = config.variables;
        this.colorScheme = {
          domain: [
            colors.primaryLight,
            colors.infoLight,
            colors.successLight,
            colors.warningLight,
            colors.dangerLight,
          ],
        };
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
