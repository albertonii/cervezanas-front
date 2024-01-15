import "../styles/globals.css";

type LayoutProps = {
  children: React.ReactNode;
};

export const metadata = {
  title: "Comunidad Cervezanas",
  description: "Cervezanas artesanales todo el año",
};

export default async function RootLayout({ children }: LayoutProps) {
  return (
    <html lang={"es"} style={{ overflow: "auto" }}>
      <body>{children}</body>
    </html>
  );
}
