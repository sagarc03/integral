import { EventHandler } from "sst/node/event-bus";
import { ApiHandler } from "sst/node/api";
import { Events } from "./events";
import { getAllWalletbyId, updateWalletSequence } from "@integral/core/wallet";
import { getWalletTransaction } from "@integral/core/aptos";
import { addTransactions, getTransactions } from "@integral/core/transactions";

export const addNewTransactions = async (id: number, last: string) => {
  const { address, sequence_number } = await getAllWalletbyId(id);
  let start = "0";
  if (sequence_number !== "") {
    start = (BigInt(sequence_number) + 1n).toString();
  }
  const transactions = await getWalletTransaction(address, start, last);
  await addTransactions(id, transactions);
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
  let page_number = 0;
  if (evt.queryStringParameters && evt.queryStringParameters.page) {
    page_number = parseInt(evt.queryStringParameters.page);
  }
  const id = parseInt(evt.pathParameters.id);
  const res = await getTransactions(id, page_number, 100);
  return {
    statusCode: 200,
    body: JSON.stringify(res),
  };
});
