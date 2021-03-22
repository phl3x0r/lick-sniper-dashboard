import { NgModule } from "@angular/core";
import { NgxEchartsModule } from "ngx-echarts";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { ChartModule } from "angular2-chartjs";
import { NbCardModule, NbIconModule } from "@nebular/theme";

import { ThemeModule } from "../../@theme/theme.module";
import { D3AreaStackComponent } from "./d3-area-stack.component";
import { PnLChartComponent } from "./pnl-chart.component";

@NgModule({
  imports: [
    ThemeModule,
    NbCardModule,
    NbIconModule,
    NgxEchartsModule,
    NgxChartsModule,
    ChartModule,
    NbCardModule,
  ],
  declarations: [D3AreaStackComponent, PnLChartComponent],
})
export class PnLChartModule {}
