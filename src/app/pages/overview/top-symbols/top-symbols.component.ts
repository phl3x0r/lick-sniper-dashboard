import { Component, OnDestroy } from "@angular/core";
import { NbJSThemeVariable, NbThemeService } from "@nebular/theme";
import { Observable } from "rxjs";
import { OrderEntriesFacade } from "../../../store/order-entries.facade";

@Component({
  selector: "top-symbols",
  template: `
    <ngx-charts-pie-chart
      [scheme]="colorScheme"
      [results]="results$ | async"
      [legend]="showLegend"
      [labels]="showLabels"
    >
    </ngx-charts-pie-chart>
  `,
})
export class TopSymbolsComponent implements OnDestroy {
  results$: Observable<{ name: string; value: number }[]>;
  showLegend = false;
  showLabels = true;
  colorScheme: any;
  themeSubscription: any;

  constructor(
    private theme: NbThemeService,
    private orderEntriesFacade: OrderEntriesFacade
  ) {
    this.themeSubscription = this.theme.getJsTheme().subscribe((config) => {
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
    this.results$ = this.orderEntriesFacade.getSymbolsProfit(24);
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
