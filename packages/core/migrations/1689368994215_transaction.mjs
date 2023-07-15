/* eslint @typescript-eslint/no-unused-vars: 0 */
import { Kysely } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  // Migration code
  await db.schema
    .createTable("transaction")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("wallet_id", "integer", (col) =>
      col.references("wallet.id").onDelete("cascade").notNull(),
    )
    .addColumn("version", "varchar")
    .addColumn("hash", "varchar")
    .addColumn("state_change_hash", "varchar")
    .addColumn("event_root_hash", "varchar")
    .addColumn("state_checkpoint_hash", "varchar")
    .addColumn("gas_used", "varchar")
    .addColumn("success", "boolean")
    .addColumn("vm_status", "varchar")
    .addColumn("accumulator_root_hash", "varchar")
    .addColumn("changes", "jsonb")
    .addColumn("sender", "varchar")
    .addColumn("sequence_number", "varchar", (col) => col.notNull())
    .addColumn("max_gas_amount", "varchar")
    .addColumn("gas_unit_price", "varchar")
    .addColumn("expiration_timestamp_secs", "varchar")
    .addColumn("payload", "jsonb")
    .addColumn("signature", "jsonb")
    .addColumn("events", "jsonb")
    .addColumn("timestamp", "varchar")
    .addUniqueConstraint("unique_wallet_id_sequence_number", [
      "wallet_id",
      "sequence_number",
    ])
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  // Migration code
  await db.schema.dropTable("transaction").execute();
}
