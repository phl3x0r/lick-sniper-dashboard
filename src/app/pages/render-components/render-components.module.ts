import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CurrencyComponent } from "./currency.component";
import { DateComponent } from "./date.component";
import { PercentageComponent } from "./percentage.component";

@NgModule({
  imports: [CommonModule],
  declarations: [DateComponent, PercentageComponent, CurrencyComponent],
  exports: [DateComponent, PercentageComponent, CurrencyComponent],
})
export class PagesModule {}
