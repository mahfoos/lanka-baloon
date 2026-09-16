import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { UserProvider } from "@/components/UserProvider";
import Sidebar from "@/components/Sidebar";

export default function ErpLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = getSession();
  if (!user) redirect("/");

  return (
    <UserProvider user={user}>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10">{children}</main>
      </div>
    </UserProvider>
  );
}
