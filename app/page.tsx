import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import HomeClient from "@/components/client/HomeClient";

export default async function HomePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <HomeClient />
  );
}
