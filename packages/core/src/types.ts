import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Json = ColumnType<JsonValue, string, string>;

export type JsonArray = JsonValue[];

export type JsonObject = {
  [K in string]?: JsonValue;
};

export type JsonPrimitive = boolean | null | number | string;

export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

export interface Transaction {
  id: Generated<number>;
  wallet_id: number;
  version: string | null;
  hash: string | null;
  state_change_hash: string | null;
  event_root_hash: string | null;
  state_checkpoint_hash: string | null;
  gas_used: string | null;
  success: boolean | null;
  vm_status: string | null;
  accumulator_root_hash: string | null;
  changes: Json | null;
  sender: string | null;
  sequence_number: string;
  max_gas_amount: string | null;
  gas_unit_price: string | null;
  expiration_timestamp_secs: string | null;
  payload: Json | null;
  signature: Json | null;
  events: Json | null;
  timestamp: string | null;
}

export interface Wallet {
  id: Generated<number>;
  address: string;
  sequence_number: Generated<string>;
}

export interface Database {
  transaction: Transaction;
  wallet: Wallet;
}
