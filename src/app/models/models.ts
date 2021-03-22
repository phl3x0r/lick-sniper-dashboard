export interface Timestamp {
  seconds: number;
  nanoseconds: number;
}

export interface Ticker {
  eventType: string;
  eventTime: number;
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvg: string;
  prevDayClose: string;
  curDayClose: string;
  closeTradeQuantity: string;
  bestBid: string;
  bestBidQnt: string;
  bestAsk: string;
  bestAskQnt: string;
  open: string;
  high: string;
  low: string;
  volume: string;
  volumeQuote: string;
  openTime: number;
  closeTime: number;
  firstTradeId: number;
  lastTradeId: number;
  totalTrades: number;
}

export interface MappedTicker {
  weightedAvg: number;
  prevDayClose: number;
  curDayClose: number;
  closeTradeQuantity: number;
  volume: number;
  volumeQuote: number;
  totalTrades: number;
}

export interface OrderUpdate {
  eventType: string;
  eventTime: number;
  transactionTime: number;
  symbol: string;
  clientOrderId: string;
  side: string;
  orderType: string;
  timeInForce: string;
  quantity: string;
  price: string;
  averagePrice: string;
  stopPrice: string;
  executionType: string;
  orderStatus: string;
  orderId: number;
  lastTradeQuantity: string;
  totalTradeQuantity: string;
  priceLastTrade: string;
  commissionAsset: string;
  commission: string;
  orderTime: number;
  tradeId: number;
  bidsNotional: string;
  asksNotional: string;
  isMaker: boolean;
  isReduceOnly: boolean;
  workingType: string;
  originalOrderType: string;
  positionSide: string;
  closePosition: boolean;
  activationPrice: string;
  callbackRate: string;
  realizedProfit: string;
}

export type OrderEntry = OrderUpdate & {
  tradeCount: number;
  walletBalance: number;
  timestamp: Timestamp;
  tags: Array<string>;
  vwap: number;
};

export type OrderEntries = Array<OrderEntry>;

export type MappedOrderEntry = {
  symbol: string;
  side: string;
  quantity: number;
  price: number;
  totalTradeQuantity: number;
  commissionAsset: string;
  commission: number;
  orderTime: number;
  tradeId: number;
  realizedProfit: number;
  pnlPercent: number;
  tradeCount: number;
  walletBalance: number;
  timestamp: Date;
  tags: Array<string>;
  vwap: number;
  vwapDistance: number;
};

export type MappedOrderEntries = Array<MappedOrderEntry>;

export interface Statistics {
  symbol: string;
  count: number;
  totalTradeCount: number;
  totalPnL: number; // profit and loss
  totalPnLPercent: number; // profit and loss
  averageTradeCount: string;
  averagePnL: number;
  averagePnLPercent: number;
  averageVwapDistance: number;
}

export type SymbolStatistics = Array<Statistics>;

export interface SymbolFilter {
  [key: string]: {
    enabled: boolean;
  };
}

export interface AlgoFilter {
  [key: string]: {
    enabled: boolean;
    expanded: boolean;
    symbols?: SymbolFilter;
  };
}

export interface AliasFilter {
  [key: string]: {
    enabled: boolean;
    expanded: boolean;
    algos?: AlgoFilter;
  };
}

export interface LogFilter {
  aliases: AliasFilter;
}

export interface GroupSettings {
  alias: boolean;
  algo: boolean;
  symbol: boolean;
}

export type DataSet = Array<{
  o: number;
  t: number;
  x: number;
  y: number;
  z: number;
}>;

export interface DataCollection {
  [key: string]: DataSet;
}
export interface DateFilter {
  enabled: boolean;
  from: Date;
  to: Date;
}
