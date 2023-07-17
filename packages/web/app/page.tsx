import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { Api } from "sst/node/api";

type Wallet = {
  id: number;
  address: string;
  sequence_number: string;
};

const getData = async (): Promise<Wallet[]> => {
  const res = await fetch(`${Api.api.url}/wallet`,{cache:"reload"});
  return await res.json();
};

const createWallet = async (data: FormData) => {
  "use server";
  await fetch(`${Api.api.url}/wallet`, {
    method: "POST",
    body: JSON.stringify({ address: data.get("address") || "" }),
  });
  revalidatePath("/");
};

const deleteWallet = async (data: FormData) => {
  "use server";
  await fetch(`${Api.api.url}/wallet/${data.get("id")}`, { method: "DELETE" });
  revalidatePath("/");
};

export default async function Home() {
  const wallets = await getData();
  return (
    <main className="container flex min-h-screen flex-col items-center p-24">
      <form action={createWallet} className="my-5 flex w-full">
        <Input name="address" className="mx-3 w-2/3" />
        <Button type="submit" className="mx-3 w-1/4">
          Add Wallet
        </Button>
      </form>

      <Table>
        <TableCaption>A list of your wallets.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Wallet Address</TableHead>
            <TableHead>Sequence Number</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {wallets.map((wallet) => {
            return (
              <TableRow key={wallet.id}>
                <TableCell className="font-medium">
                  <Link href={`/${wallet.id}`}>{wallet.address}</Link>
                </TableCell>
                <TableCell className="text-center">
                  {wallet.sequence_number}
                </TableCell>
                <TableCell>
                  <form>
                    <input hidden defaultValue={wallet.id} name="id" />
                    <Button
                      type="submit"
                      formAction={deleteWallet}
                      variant="destructive"
                    >
                      Remove
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </main>
  );
}
