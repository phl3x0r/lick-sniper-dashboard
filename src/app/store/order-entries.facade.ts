import { Injectable } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import {
  OrderEntryState,
  selectLongShortProfit,
  selectOrderEntriesSorted,
  selectPnLChartDataPoints,
  selectProfitBySymbol,
  selectSymbolStats,
  selectTotalTradeCount,
} from "./order-entries.reducer";

@Injectable({ providedIn: "root" })
export class OrderEntriesFacade {
  constructor(private store: Store<OrderEntryState>) {}

  public getEntries() {
    return this.store.pipe(select(selectOrderEntriesSorted));
  }

  public getSymbolStats() {
    return this.store.pipe(select(selectSymbolStats));
  }

  public getTradeCount(hours?: number) {
    return this.store.pipe(select(selectTotalTradeCount(hours)));
  }

  public getPnLChartDataPoints(hours?: number) {
    return this.store.pipe(select(selectPnLChartDataPoints(hours)));
  }

  public getSymbolsProfit(
    hours: number
  ): Observable<{ name: string; value: number }[]> {
    return this.store.pipe(select(selectProfitBySymbol(hours)));
  }

  public getLongShortProfit(
    hours: number
  ): Observable<{ name: string; value: number }[]> {
    return this.store.pipe(select(selectLongShortProfit(hours)));
  }
}
