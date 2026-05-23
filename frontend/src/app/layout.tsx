import Layout from "@/components/Layout";
import AuthLoader from "@/components/AuthLoader";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* 🔴 body tag ke andar yeh attribute daal dein */}
      <body suppressHydrationWarning={true}>
        <Layout>
          <AuthLoader>
            {children}
          </AuthLoader>
        </Layout>
      </body>
    </html>
  );
}