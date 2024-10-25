import Navbar from "@/components/Navbar";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-full flex-col ">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
