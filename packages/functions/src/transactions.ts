import { EventHandler } from "sst/node/event-bus";
import { ApiHandler } from "sst/node/api";
import { Events } from "./events";
import { getAllWalletbyId, updateWalletSequence } from "@integral/core/wallet";
import {
  countTransactions,
  getTransactions,
} from "@integral/core/transactions";
import { addWalletTransaction } from "@integral/core/wrapper";

export const addNewTransactions = async (id: number, last: string) => {
  const { address, sequence_number } = await getAllWalletbyId(id);
  let start = "0";
  if (sequence_number !== "") {
    start = (BigInt(sequence_number) + 1n).toString();
  }
  await addWalletTransaction(id, address, start, last);
  await updateWalletSequence(id, last);
};

export const walletCreated = EventHandler(
  Events.WALLET.CREATED,
  async (evt) => {
    addNewTransactions(evt.properties.id, evt.properties.last_sequence);
  },
);

export const list = ApiHandler(async (evt) => {
  if (evt.pathParameters === undefined || evt.pathParameters.id === undefined) {
    return {
      statusCode: 404,
    };
  }
  let page_number = 1;
  let page_size = 100;
  if (evt.queryStringParameters && evt.queryStringParameters.page) {
    page_number = parseInt(evt.queryStringParameters.page);
    if (page_number <= 0) {
      page_number = 1;
    }
  }
  if (evt.queryStringParameters && evt.queryStringParameters.size) {
    page_size = parseInt(evt.queryStringParameters.size);
    if (page_size <= 0) {
      page_size = 100;
    }
  }
  const id = parseInt(evt.pathParameters.id);

  const res = await getTransactions(id, page_number, page_size);
  const wallet = await getAllWalletbyId(id);
  const [count] = await countTransactions(id);

  return {
    statusCode: 200,
    body: JSON.stringify({
      transactions: res,
      address: wallet.address,
      page_number: page_number,
      page_size: page_size,
      total_records: count.count,
    }),
  };
});
