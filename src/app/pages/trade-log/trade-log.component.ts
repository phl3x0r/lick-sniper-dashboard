import { Component, OnDestroy, OnInit } from "@angular/core";
import { OrderEntriesFacade } from "../../store";
import { LocalDataSource } from "ng2-smart-table";
import { map, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import firebase from "firebase/app";
import {
  CurrencyComponent,
  DateComponent,
  PercentageComponent,
} from "../render-components";

@Component({
  selector: "trade-log",
  templateUrl: "./trade-log.component.html",
  styleUrls: ["./trade-log.component.scss"],
})
export class TradeLogComponent implements OnInit, OnDestroy {
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
      date: {
        title: "Date",
        type: "custom",
        renderComponent: DateComponent,
      },
      symbol: {
        title: "Symbol",
        type: "string",
      },
      direction: {
        title: "Direction",
        type: "string",
      },
      pnl: {
        title: "PnL",
        type: "custom",
        renderComponent: CurrencyComponent,
      },
      pnlPercent: {
        title: "PnL %",
        type: "custom",
        renderComponent: PercentageComponent,
      },
      tradeCount: {
        title: "Trade Count",
        type: "number",
      },
      vwapDist: {
        title: "VWAP Distance",
        type: "custom",
        renderComponent: PercentageComponent,
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();
  private data$ = this.service.getEntries().pipe(
    map((entries) =>
      entries
        .map((entry) => ({
          date: entry.timestamp,
          symbol: entry.symbol,
          direction: entry.side,
          pnl: entry.realizedProfit,
          pnlPercent: entry.realizedProfit / entry.walletBalance,
          tradeCount: entry.tradeCount,
          vwapDist: !isNaN(entry.vwapDistance) ? entry.vwapDistance : "N/A",
        }))
        .sort((a, b) => b.date.getTime() - a.date.getTime())
    )
  );
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
