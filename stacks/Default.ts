import { StackContext, NextjsSite, RDS } from "sst/constructs";

export function Default({ stack }: StackContext) {
  const rds = new RDS(stack, "database", {
    engine: "postgresql13.9",
    defaultDatabaseName: "db",
    migrations: "packages/core/migration",
  });
  const site = new NextjsSite(stack, "site", {
    path: "packages/web",
  });
  stack.addOutputs({
    SiteUrl: site.url,
    ClusterArn: rds.clusterArn,
  });
}
