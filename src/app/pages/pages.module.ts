import { NgModule } from "@angular/core";
import { NbMenuModule } from "@nebular/theme";

import { ThemeModule } from "../@theme/theme.module";
import { PagesComponent } from "./pages.component";
import { DashboardModule } from "./dashboard/dashboard.module";
import { ECommerceModule } from "./e-commerce/e-commerce.module";
import { PagesRoutingModule } from "./pages-routing.module";
import { MiscellaneousModule } from "./miscellaneous/miscellaneous.module";
import { TradeLogModule } from "./trade-log/trade-log.module";
import { SymbolStatsModule } from "./trade-stats/symbol-stats.module";
import { PnLChartModule } from "./pnl-chart/pnl-chart.module";
import { OverviewModule } from "./overview/overview.module";

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    OverviewModule,
    TradeLogModule,
    SymbolStatsModule,
    PnLChartModule,
    DashboardModule,
    ECommerceModule,
    MiscellaneousModule,
  ],
  declarations: [PagesComponent],
})
export class PagesModule {}
