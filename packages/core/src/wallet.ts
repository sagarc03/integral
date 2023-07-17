import { db } from "./db";

export async function getAllWalletbyId(id: number) {
  return await db
    .selectFrom("wallet")
    .where("id", "=", id)
    .select("id")
    .select("address")
    .select("sequence_number")
    .executeTakeFirstOrThrow();
}

export async function getAllWallet() {
  return await db
    .selectFrom("wallet")
    .select("id")
    .select("address")
    .select("sequence_number")
    .execute();
}

export async function addWallet(address: string) {
  const { id } = await db
    .insertInto("wallet")
    .values({ address })
    .returning("id")
    .executeTakeFirstOrThrow();
  return id;
}

export async function destoryWallet(id: number) {
  await db.deleteFrom("wallet").where("id", "=", id).execute();
}

export async function updateWalletSequence(
  id: number,
  sequence_number: string,
) {
  await db
    .updateTable("wallet")
    .set({ "sequence_number": sequence_number })
    .where("id", "=", id)
    .executeTakeFirstOrThrow();
}
