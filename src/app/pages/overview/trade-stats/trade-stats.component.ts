import { Component, OnDestroy, OnInit } from "@angular/core";
import { OrderEntriesFacade } from "../../../store";
import { LocalDataSource } from "ng2-smart-table";
import { takeUntil } from "rxjs/operators";

import { Subject } from "rxjs";
import {
  CurrencyComponent,
  PercentageComponent,
} from "../../render-components";

@Component({
  selector: "trade-stats",
  templateUrl: "./trade-stats.component.html",
  styleUrls: ["./trade-stats.component.scss"],
})
export class TradeStatsComponent implements OnInit, OnDestroy {
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
  public tradeCount$ = this.service.getTradeCount(24);
  private destroy$ = new Subject<void>();
  constructor(private service: OrderEntriesFacade) {}

  ngOnInit(): void {
    // this.data$
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((data) => this.source.load(data));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
