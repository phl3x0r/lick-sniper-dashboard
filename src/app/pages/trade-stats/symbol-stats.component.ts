import { Component, OnDestroy, OnInit } from "@angular/core";
import { OrderEntriesFacade } from "../../store";
import { LocalDataSource } from "ng2-smart-table";
import { map, takeUntil } from "rxjs/operators";

import { SmartTableData } from "../../@core/data/smart-table";
import { OrderEntry } from "../../models";
import { Subject } from "rxjs";
import { CurrencyComponent, PercentageComponent } from "../render-components";

@Component({
  selector: "symbol-stats",
  templateUrl: "./symbol-stats.component.html",
  styleUrls: ["./symbol-stats.component.scss"],
})
export class SymbolStatsComponent implements OnInit, OnDestroy {
  settings = {
    editable: false,
    hideSubHeader: true,
    actions: {
      columnTitle: "",
      add: false,
      edit: false,
      delete: false,
      position: "left",
    },
    columns: {
      symbol: {
        title: "Symbol",
        type: "string",
      },
      count: {
        title: "Count",
        type: "number",
      },
      totalTradeCount: {
        title: "Total Trades",
        type: "number",
      },
      averageTradeCount: {
        title: "Avg. Trade Count",
        type: "string",
      },
      totalPnL: {
        title: "Total PnL",
        type: "custom",
        renderComponent: CurrencyComponent,
      },
      totalPnLPercent: {
        title: "Accumaleted %",
        type: "custom",
        renderComponent: PercentageComponent,
      },
      averagePnL: {
        title: "Mean PnL",
        type: "custom",
        renderComponent: CurrencyComponent,
      },
      averagePnLPercent: {
        title: "Mean Accumulated %",
        type: "custom",
        renderComponent: PercentageComponent,
      },
      averageVwapDistance: {
        title: "Mean VWAP Distance",
        type: "custom",
        renderComponent: PercentageComponent,
      },
    },
  };

  /**
 *   symbol: string;
  count: number;
  totalTradeCount: number;
  totalPnL: number; // profit and loss
  totalPnLPercent: number; // profit and loss
  averageTradeCount: number;
  averagePnL;
  averagePnLPercent;
  averageVwapDistance;
 */

  source: LocalDataSource = new LocalDataSource();
  private data$ = this.service.getSymbolStats();
  private destroy$ = new Subject<void>();
  constructor(private service: OrderEntriesFacade) {}

  ngOnInit(): void {
    this.data$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => this.source.load(data));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
