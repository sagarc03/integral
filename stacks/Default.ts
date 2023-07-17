import {
  Api,
  Cron,
  EventBus,
  NextjsSite,
  RDS,
  StackContext,
} from "sst/constructs";

export function Default({ stack }: StackContext) {
  const rds = new RDS(stack, "Database", {
    engine: "postgresql13.9",
    defaultDatabaseName: "integral",
    migrations: "packages/core/migrations",
    scaling: {
      autoPause: true,
      minCapacity: "ACU_2",
      maxCapacity: "ACU_2",
    },
    types: "packages/core/src/types.ts",
  });

  const bus = new EventBus(stack, "bus", {
    defaults: {
      retries: 5,
    },
  });

  bus.subscribe("wallet.created", {
    handler: "packages/functions/src/transactions.walletCreated",
    bind: [rds],
  });

  const cron = new Cron(stack, "cron", {
    schedule: "rate(4 hours)",
    job: "packages/functions/src/wallet.checkForNewTransaction",
  });
  cron.bind([rds, bus]);

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        bind: [rds, bus],
      },
    },
    routes: {
      "GET /wallet": "packages/functions/src/wallet.list",
      "GET /wallet/{id}": "packages/functions/src/transactions.list",
      "POST /wallet": "packages/functions/src/wallet.create",
      "DELETE /wallet/{id}": "packages/functions/src/wallet.destroy",
    },
  });

  const site = new NextjsSite(stack, "site", {
    path: "packages/web",
    bind: [api],
  });

  stack.addOutputs({
    SiteUrl: site.url,
    ApiEndpoint: api.url,
  });
}
