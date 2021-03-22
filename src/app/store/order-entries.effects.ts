import { createEffect } from "@ngrx/effects";
import { addOrderEntries } from "./order-entries.actions";
import { map, tap, switchMap, take } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";
import { OrderEntry as OrderEntry } from "../models";
import { environment } from "../../environments/environment";
import { Injectable } from "@angular/core";
import {
  OrderEntryState,
  selectLatestEntryTime,
} from "./order-entries.reducer";
import { Store } from "@ngrx/store";
import firebase from "firebase/app";

@Injectable()
export class TradeLogEffects {
  constructor(
    private fs: AngularFirestore,
    private store: Store<OrderEntryState>
  ) {}

  onTradeLogUpdate$ = createEffect(() =>
    this.store
      .select(selectLatestEntryTime)
      .pipe(
        take(1),
        switchMap((latest) =>
          this.fs
            .collection<OrderEntry>(environment.collection, (ref) =>
              latest ? ref.where("timestamp", ">", latest) : ref
            )
            .valueChanges({ idField: "id" })
            .pipe(tap(console.log))
        )
      )
      .pipe(
        tap(() => console.warn("Using LIVE data")),
        map((logEntries) => addOrderEntries({ logEntries }))
      )
  );
}
