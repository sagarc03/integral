import { createEventBuilder } from "sst/node/event-bus";
import { z } from "zod";

const event = createEventBuilder({
  bus: "bus",
});

export const Events = {
  WALLET: {
    CREATED: event("wallet.created", {
      id: z.number(),
      last_sequence: z.string(),
    }),
  },
};
