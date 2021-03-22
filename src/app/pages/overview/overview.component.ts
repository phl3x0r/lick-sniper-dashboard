import { Component, OnDestroy, OnInit } from "@angular/core";
import { OrderEntriesFacade } from "../../store";
import { LocalDataSource } from "ng2-smart-table";
import { map, takeUntil } from "rxjs/operators";

import { SmartTableData } from "../../@core/data/smart-table";
import { OrderEntry } from "../../models";
import { Subject } from "rxjs";
import { CurrencyComponent, PercentageComponent } from "../render-components";

@Component({
  selector: "overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.scss"],
})
export class OverviewComponent implements OnInit, OnDestroy {
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
