import { NgModule } from "@angular/core";
import {
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbTreeGridModule,
} from "@nebular/theme";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { NgxChartsModule } from "@swimlane/ngx-charts";

import { ThemeModule } from "../../@theme/theme.module";
import { OverviewComponent } from "./overview.component";
import { TopSymbolsComponent } from "./top-symbols/top-symbols.component";
import { PnLChartComponent } from "./pnl-chart/pnl-chart.component";

@NgModule({
  imports: [
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    NgxChartsModule,
    Ng2SmartTableModule,
  ],
  declarations: [OverviewComponent, TopSymbolsComponent, PnLChartComponent],
})
export class OverviewModule {}
