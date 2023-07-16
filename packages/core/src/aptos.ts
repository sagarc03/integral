import { ApiError, AptosClient, Types } from "aptos";

const NODE_URL = "https://fullnode.mainnet.aptoslabs.com/v1";

export const client = new AptosClient(NODE_URL);

export async function validateWalletAndReturnSequenceNumber(address: string) {
  try {
    const account = await client.getAccount(address);
    return {
      isValid: true,
      sequence_number: account.sequence_number,
      message: "account valid",
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        isValid: false,
        message: error.message,
      };
    }
    return {
      isValid: false,
      sequence_number: "",
      message: "something went wrong",
    };
  }
}

export async function getWalletTransaction(
  address: string,
  start_sequence_number: string,
  end_sequence_number: string,
) {
  let start = BigInt(start_sequence_number);
  const lastSeq = BigInt(end_sequence_number);
  let end = start + 100n;
  const data: Types.Transaction_UserTransaction[] = [];
  while (start < lastSeq) {
    const evts = await client.getAccountTransactions(address, {
      start,
      limit: 99,
    });

    evts.forEach((element) => {
      if (element.type === "user_transaction") {
        data.push(element as Types.Transaction_UserTransaction);
      }
    });

    start = end;
    end += 100n;
  }
  return data;
}
