import { StackContext, NextjsSite, RDS } from "sst/constructs";

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
  const site = new NextjsSite(stack, "site", {
    path: "packages/web",
  });
  stack.addOutputs({
    SiteUrl: site.url,
    ClusterArn: rds.clusterArn,
  });
}
