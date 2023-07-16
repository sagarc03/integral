import { validateWalletAndReturnSequenceNumber } from "@integral/core/aptos";
import { addWallet, destoryWallet, getAllWallet } from "@integral/core/wallet";
import { ApiHandler } from "sst/node/api";
import { Events } from "./events";

export const list = ApiHandler(async (_evt) => {
  const res = await getAllWallet();
  return {
    statusCode: 200,
    body: JSON.stringify(res),
  };
});

export const create = ApiHandler(async (evt) => {
  if (evt.body === undefined) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "wallet address is required",
      }),
    };
  }
  const body = JSON.parse(evt.body);
  if (body.address === undefined) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "wallet address is required",
      }),
    };
  }
  const { isValid, message, sequence_number } =
    await validateWalletAndReturnSequenceNumber(body.address);

  if (!isValid || sequence_number === undefined) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message, sequence_number }),
    };
  }

  const id = await addWallet(body.address);

  Events.WALLET.CREATED.publish({ id, last_sequence: sequence_number });

  return {
    statusCode: 200,
    body: JSON.stringify({ id }),
  };
});

export const destroy = ApiHandler(async (evt) => {
  if (evt.pathParameters === undefined || evt.pathParameters.id === undefined) {
    return {
      statusCode: 404,
    };
  }
  const id = parseInt(evt.pathParameters?.id);
  await destoryWallet(id);
  return {
    statusCode: 202,
  };
});

export const checkForNewTransaction = async () => {
  const wallets = await getAllWallet();
  wallets.forEach(async (wallet) => {
    const { sequence_number } = await validateWalletAndReturnSequenceNumber(
      wallet.address,
    );
    if (sequence_number == undefined) {
      return;
    }
    if (sequence_number !== wallet.sequence_number) {
      Events.WALLET.CREATED.publish({
        id: wallet.id,
        last_sequence: sequence_number,
      });
    }
  });
};
