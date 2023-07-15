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
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  // Migration code
  await db.schema.dropTable("wallet").execute();
}
