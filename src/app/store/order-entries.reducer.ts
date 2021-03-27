import {
  createReducer,
  on,
  Action,
  createFeatureSelector,
  createSelector,
} from "@ngrx/store";
import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import {
  MappedOrderEntries,
  MappedOrderEntry,
  MappedTicker,
  OrderEntries,
  OrderEntry,
  Statistics,
  SymbolStatistics,
  Ticker,
} from "../models";
import {
  addOrderEntries,
  updateFilter,
  updateGroupSettings,
} from "./order-entries.actions";
import firebase from "firebase/app";
import { cursorTo } from "readline";
import { TradeLogEffects } from "./order-entries.effects";
import { LegendEntryComponent } from "@swimlane/ngx-charts";

export interface OrderEntryState extends EntityState<OrderEntry> {}
export const adapter: EntityAdapter<OrderEntry> = createEntityAdapter<OrderEntry>();
export const initialState: OrderEntryState = adapter.getInitialState({});
export const featureSelectorKey = "orderEntries";

export const OrderEntriesReducer = createReducer(
  initialState,
  on(addOrderEntries, (state, { logEntries }) => {
    console.log(logEntries);
    return adapter.upsertMany(logEntries, state);
  }),
  on(updateFilter, (state, { filter }) => ({
    ...state,
    filter,
  })),
  on(updateGroupSettings, (state, { groupSettings }) => ({
    ...state,
    groupSettings,
  }))
);

export function reducer(state: OrderEntryState, action: Action) {
  return OrderEntriesReducer(state, action);
}

// ** Mappings ** //

export const getDistance = (price: number, origin: number): number =>
  Math.abs(1 - price / origin);

const mapTicker = (t: Ticker): MappedTicker =>
  <MappedTicker>{
    closeTradeQuantity: Number.parseFloat(t.closeTradeQuantity),
    curDayClose: Number.parseFloat(t.curDayClose),
    prevDayClose: Number.parseFloat(t.prevDayClose),
    totalTrades: t.totalTrades,
    volume: Number.parseFloat(t.volume),
    volumeQuote: Number.parseFloat(t.volumeQuote),
    weightedAvg: Number.parseFloat(t.weightedAvg),
  };

const mapLogEntries = (logEntries: OrderEntries): MappedOrderEntries =>
  logEntries.map(
    (e) =>
      <MappedOrderEntry>{
        price: Number.parseFloat(e.price),
        commission: Number.parseFloat(e.commission),
        commissionAsset: e.commissionAsset,
        orderTime: e.orderTime,
        quantity: Number.parseFloat(e.quantity),
        realizedProfit: Number.parseFloat(e.realizedProfit),
        side: e.side === "BUY" ? "SHORT" : "LONG",
        symbol: e.symbol,
        tags: e.tags,
        timestamp: new firebase.firestore.Timestamp(
          e.timestamp.seconds,
          e.timestamp.nanoseconds
        ).toDate(),
        totalTradeQuantity: Number.parseFloat(e.totalTradeQuantity),
        tradeCount: e.tradeCount,
        tradeId: e.tradeId,
        walletBalance: e.walletBalance,
        pnlPercent: Number.parseFloat(e.realizedProfit) / e.walletBalance,
        vwapDistance:
          (e.vwap && getDistance(e.vwap, Number.parseFloat(e.price))) || NaN,
      }
  );

// ** Selectors ** //
export const selectOrderEntryState = createFeatureSelector<OrderEntryState>(
  featureSelectorKey
);
export const {
  selectIds: selectOrderEntryIds,
  selectEntities: selectOrderEntryEntities,
  selectAll: selectAllOrderEntries,
  selectTotal: selectOrderEntrysTotal,
} = adapter.getSelectors(selectOrderEntryState);

export const selectOrderEntriesMapped = createSelector(
  selectAllOrderEntries,
  (entries) => mapLogEntries(entries)
);

export const selectOrderEntriesSorted = createSelector(
  selectOrderEntriesMapped,
  (entries) =>
    entries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
);

export const selectOrderEntriesSortedSince = (hours?: number) =>
  createSelector(selectOrderEntriesMapped, (entries) => {
    const d = new Date();
    d.setHours(d.getHours() - hours);
    return entries
      .filter((entry) =>
        hours ? entry.timestamp.getTime() > d.getTime() : true
      )
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  });

// symbol statistics
export const selectUniquieSymbols = createSelector(
  selectOrderEntriesMapped,
  (entries: MappedOrderEntries) => [
    ...new Set([...entries.map((e) => e.symbol)]),
  ]
);

export const selectSymbolStats = createSelector(
  selectUniquieSymbols,
  selectOrderEntriesMapped,
  (symbols, entries) =>
    <SymbolStatistics>(
      symbols.reduce((acc, cur) => [...acc, getStatistics(cur, entries)], [])
    )
);

export const selectTotalTradeCount = (hours?: number) =>
  createSelector(selectOrderEntriesSortedSince(hours), (entries) => {
    const totalTradeCount = entries.reduce(
      (acc, cur) => (acc += cur.tradeCount),
      0
    );
    return totalTradeCount;
  });

const calculateDatapoints = (
  acc: { name: string; value: number }[],
  cur: MappedOrderEntry
): ({ name: string; value: number } | { name: Date; value: number })[] => [
  ...acc,
  {
    name: cur.timestamp,
    value: cur.realizedProfit + acc[acc.length - 1]?.value || 0,
  },
];

export const selectPnLChartDataPoints = (hours?: number) =>
  createSelector(selectOrderEntriesSortedSince(hours), (entries) => {
    const reversed = entries.reverse();
    return [
      {
        name: "Long",
        series: reversed
          .filter((e) => e.side === "LONG")
          .reduce(
            calculateDatapoints,
            <Array<{ name: string; value: number }>>[]
          ),
      },
      {
        name: "Short",
        series: reversed
          .filter((e) => e.side === "SHORT")
          .reduce(
            calculateDatapoints,
            <Array<{ name: string; value: number }>>[]
          ),
      },
      {
        name: "Total",
        series: reversed.reduce(
          calculateDatapoints,
          <Array<{ name: string; value: number }>>[]
        ),
      },
    ];
  });

export const selectProfitBySymbol = (hours?: number) =>
  createSelector(selectOrderEntriesSortedSince(hours), (entries) => {
    const mapped = entries.reduce((acc, cur) => {
      acc[cur.symbol] = (acc[cur.symbol] || 0) + cur.realizedProfit;
      return acc;
    }, {});
    return Object.keys(mapped)
      .map((key) => ({
        name: key,
        value: mapped[key],
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  });

export const selectLongShortProfit = (hours?: number) =>
  createSelector(selectOrderEntriesSortedSince(hours), (entries) => {
    const mapped = entries.reduce((acc, cur) => {
      acc[cur.side] = (acc[cur.side] || 0) + cur.realizedProfit;
      return acc;
    }, {});
    return Object.keys(mapped).map((key) => ({
      color: "#FF0",
      name: key,
      value: mapped[key],
    }));
  });

export const selectLatestEntryTime = createSelector(
  selectOrderEntriesSorted,
  (entries) => entries && entries.length && entries[0].timestamp
);
function getStatistics(
  symbol: string,
  entries: MappedOrderEntries
): Statistics {
  const filtered = entries.filter((e) => e.symbol === symbol);
  const sorted = filtered.sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );
  const tempArr: Array<MappedOrderEntry> = [];
  const collated: Array<MappedOrderEntry> = [];
  sorted.forEach((entry) => {
    if (entry.tradeCount === 0) {
      tempArr.push(entry);
    } else if (!!tempArr.length) {
      // collate current trade and tempArr trades
      const trades = [...tempArr, entry];
      const colTrade = <MappedOrderEntry>{
        symbol,
        commission: trades.reduce((acc, cur) => (acc += cur.commission), 0),
        commissionAsset: entry.commissionAsset,
        orderTime: tempArr[0].orderTime,
        pnlPercent:
          trades.reduce(
            (acc, cur) => (acc *= 1 + cur.realizedProfit / cur.walletBalance),
            1
          ) - 1,
        price: tempArr[0].price,
        quantity: trades.reduce((acc, cur) => (acc += cur.quantity), 0),
        realizedProfit: trades.reduce(
          (acc, cur) => (acc += cur.realizedProfit),
          0
        ),
        side: tempArr[0].side,
        tags: tempArr[0].tags,
        timestamp: tempArr[0].timestamp,
        totalTradeQuantity: trades.reduce(
          (acc, cur) => (acc += cur.totalTradeQuantity),
          0
        ),
        tradeCount: trades.reduce((acc, cur) => (acc += cur.tradeCount), 0),
        tradeId: tempArr[0].tradeId,
        vwap: tempArr[0].vwap,
        vwapDistance: tempArr[0].vwapDistance,
        walletBalance: tempArr[0].walletBalance,
      };
      collated.push(colTrade);
      // empty the temp array
      tempArr.splice(0, tempArr.length);
    } else {
      collated.push(entry);
    }
  });

  const totalPnL = collated.reduce(
    (acc, cur) => (acc += cur.realizedProfit),
    0
  );
  const totalPnLPercent =
    collated.reduce(
      (acc, cur) => (acc *= 1 + cur.realizedProfit / cur.walletBalance),
      1
    ) - 1;
  const totalTradeCount = collated.reduce(
    (acc, cur) => (acc += cur.tradeCount || 0),
    0
  );
  const vwaps = collated.filter((e) => !!e.vwapDistance);
  const averageVwapDistance =
    vwaps.reduce((acc, cur) => (acc += cur.vwapDistance), 0) / vwaps.length;
  return <Statistics>{
    symbol,
    count: collated.length,
    totalPnL,
    averagePnL: totalPnL / collated.length,
    totalTradeCount,
    averageTradeCount: (totalTradeCount / collated.length).toFixed(2),
    totalPnLPercent,
    averagePnLPercent: totalPnLPercent / collated.length,
    averageVwapDistance,
  };
}
