import { Types } from "aptos";
import { client } from "./aptos";
import { addTransactions } from "./transactions";

export async function addWalletTransaction(
  wallet_id: number,
  address: string,
  start_sequence_number: string,
  end_sequence_number: string,
) {
  let start = BigInt(start_sequence_number);
  const lastSeq = BigInt(end_sequence_number);
  let end = start + 100n;
  while (start < lastSeq) {
    const data: Types.Transaction_UserTransaction[] = [];
    const evts = await client.getAccountTransactions(address, {
      start,
      limit: 99,
    });

    evts.forEach((element) => {
      if (element.type === "user_transaction") {
        data.push(element as Types.Transaction_UserTransaction);
      }
    });
    await addTransactions(wallet_id, data);
    start = end;
    end += 100n;
  }
}
