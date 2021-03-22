import { createAction, props } from "@ngrx/store";
import { LogFilter, GroupSettings, DateFilter, OrderEntries } from "../models";

export const addOrderEntries = createAction(
  "[OrderEntries] Add trade log entries",
  props<{ logEntries: OrderEntries }>()
);

export const updateFilter = createAction(
  "[Filters] Update filter",
  props<{ filter: LogFilter }>()
);

export const updateDateFilter = createAction(
  "[Filters] Update date filter",
  props<{ dateFilter: DateFilter }>()
);

export const updateGroupSettings = createAction(
  "[Filters] Update group settings",
  props<{ groupSettings: GroupSettings }>()
);
