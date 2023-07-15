import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Api } from "sst/node/api";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";

type Transaction = {
  id: number;
  wallet_id: number;
  version: string | undefined;
  hash: string | undefined;
  gas_used: string | undefined;
  success: boolean | undefined;
  sequence_number: string;
  max_gas_amount: string | undefined;
  gas_unit_price: string | undefined;
  expiration_timestamp_secs: string | undefined;
  signature: object | undefined;
  timestamp: string | undefined;
};
async function getData(
  id: number,
  page: number,
  size: number,
): Promise<{
  transactions: Transaction[];
  address: string;
  count: number;
  page_number: number;
  page_size: number;
  total_records: number;
}> {
  const res = await fetch(
    `${Api.api.url}/wallet/${id}?page=${page}&size=${size}`,
    { cache: "no-cache" },
  );
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function Home({
  params,
  searchParams,
}: {
  params: { id: number };
  searchParams: { page: string | undefined; size: string | undefined };
}) {
  const id = params.id;
  let page_number = 1;
  let page_size = 100;
  if (searchParams.page) {
    page_number = parseInt(searchParams.page);
  }
  if (searchParams.size) {
    page_size = parseInt(searchParams.size);
  }

  const data = await getData(id, page_number, page_size);
  const number_of_pages = Math.ceil(data.total_records / page_size);

  return (
    <main className="container flex min-h-screen flex-col items-center p-24">
      <Table>
        <TableCaption>
          {data.address !== "" && `A list of transactions for ${data.address}.`}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Version</TableHead>
            <TableHead>Hash</TableHead>
            <TableHead>Success</TableHead>
            <TableHead>Sequence Number</TableHead>
            <TableHead>Gas Used</TableHead>
            <TableHead>Max Gas Amount</TableHead>
            <TableHead>Gas Unit Price</TableHead>
            <TableHead>Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.transactions.map((transaction) => {
            return (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.version}</TableCell>
                <TableCell>{transaction.hash}</TableCell>
                <TableCell>{transaction.sequence_number}</TableCell>
                <TableCell>{transaction.gas_used}</TableCell>
                <TableCell>{transaction.max_gas_amount}</TableCell>
                <TableCell>{transaction.gas_unit_price}</TableCell>
                <TableCell>{transaction.timestamp}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div className="flex gap-2 p-2">
        <Link
          href={`/${id}?page=${
            page_number <= 1 ? page_number : page_number - 1
          }&size=${page_size}`}
        >
          <Button size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>

        <Link
          href={`/${id}?page=${
            page_number < number_of_pages ? page_number + 1 : page_number
          }&size=${page_size}`}
        >
          <Button size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </main>
  );
}
