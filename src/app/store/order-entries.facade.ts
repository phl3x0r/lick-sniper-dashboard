import { Injectable } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import {
  OrderEntryState,
  selectOrderEntriesSorted,
  selectPnLChartDataPoints,
  selectProfitBySymbol,
  selectSymbolStats,
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

  public getPnLChartDataPoints(hours?: number) {
    return this.store.pipe(select(selectPnLChartDataPoints(hours)));
  }

  public getSymbolsProfit(
    hours: number
  ): Observable<{ name: string; value: number }[]> {
    return this.store.pipe(select(selectProfitBySymbol(hours)));
  }
}
