import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="px-4 mx-auto max-w-6xl mt-20">
      <Toaster position="top-center" />
      {children}
    </div>
  );
}
