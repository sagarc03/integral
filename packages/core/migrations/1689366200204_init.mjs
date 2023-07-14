/* eslint @typescript-eslint/no-unused-vars: 0 */
import { Kysely } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  // Migration code
  await db.schema
    .createTable("wallet")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("address", "varchar", (col) => col.notNull().unique())
    .addColumn("sequence_number", "varchar", (col) =>
      col.notNull().defaultTo(""),
    )
    .execute();

  // await db.schema
  //   .createTable("transaction")
  //   .addColumn("wallet_id", (col) =>
  //     col.references("wallet.id").onDelete("cascade").notNull(),
  //   )
  //   .addColumn("version", "varchar", (col) => col.notNull())
  //   .addColumn("hash", "varchar", (col) => col.notNull())
  //   .addColumn("state_change_hash", "varchar", (col) => col.notNull())
  //   .addColumn("event_root_hash", "varchar", (col) => col.notNull())
  //   .addColumn("state_checkpoint_hash", "varchar")
  //   .addColumn("gas_used", "varchar", (col) => col.notNull())
  //   .addColumn("success", "boolean", (col) => col.notNull())
  //   .addColumn("vm_status", "varchar", (col) => col.notNull())
  //   .addColumn("accumulator_root_hash", "varchar", (col) => col.notNull())
  //   .addColumn("changes", "jsonb", (col) => col.notNull())
  //   .addColumn("sender", "varchar", (col) => col.notNull())
  //   .addColumn("sequence_number", "varchar", (col) => col.notNull())
  //   .addColumn("max_gas_amount", "varchar", (col) => col.notNull())
  //   .addColumn("gas_unit_price", "varchar", (col) => col.notNull())
  //   .addColumn("expiration_timestamp_secs", "varchar", (col) => col.notNull())
  //   .addColumn("payload", "jsonb", (col) => col.notNull())
  //   .addColumn("signature", "jsonb")
  //   .addColumn("events", "jsonb", (col) => col.notNull())
  //   .addColumn("timestamp", "varchar", (col) => col.notNull())
  //   .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  // Migration code
  // await db.schema.dropTable("transaction").execute();
  await db.schema.dropTable("wallet").execute();
}
