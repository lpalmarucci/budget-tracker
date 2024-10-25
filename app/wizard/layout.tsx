export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="relative flex w-full h-screen flex-col items-center justify-center">{children}</div>;
}
