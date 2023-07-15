import { db, json } from "./db";
import { Types } from "aptos";

export async function getTransactions(
  wallet_id: number,
  page_number: number,
  items_per_page = 100,
) {
  return await db
    .selectFrom("transaction")
    .selectAll()
    .where("wallet_id", "=", wallet_id)
    .orderBy("timestamp")
    .offset(page_number * items_per_page)
    .limit(items_per_page)
    .execute();
}

export async function addTransactions(
  wallet_id: number,
  transactions: Types.Transaction_UserTransaction[],
) {
  transactions.forEach(async (transaction) => {
    await db
      .insertInto("transaction")
      .values({
        wallet_id: wallet_id,
        version: transaction.version,
        hash: transaction.hash,
        state_change_hash: transaction.state_change_hash,
        event_root_hash: transaction.event_root_hash,
        state_checkpoint_hash: transaction.state_checkpoint_hash,
        gas_used: transaction.gas_used,
        success: transaction.success,
        vm_status: transaction.vm_status,
        accumulator_root_hash: transaction.accumulator_root_hash,
        changes: json(transaction.changes),
        sender: transaction.sender,
        sequence_number: transaction.sequence_number,
        max_gas_amount: transaction.max_gas_amount,
        gas_unit_price: transaction.gas_unit_price,
        expiration_timestamp_secs: transaction.expiration_timestamp_secs,
        payload: json(transaction.payload),
        ...(transaction.signature && {
          signature: json(transaction.signature),
        }),
        // @ts-expect-error: type mistmatch
        events: json(transaction.events),
        timestamp: transaction.timestamp,
      })
      .onConflict((oc) => oc.doNothing())
      .execute();
  });
}
