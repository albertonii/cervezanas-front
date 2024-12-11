// app/event-orders/[cp_id]/layout.tsx
export default function Layout({ children }: { children: React.ReactNode }) {
    // Aquí no incluyes headers, footers ni nada adicional.
    return (
        <html lang="en">
            <body style={{ margin: 0, padding: 0 }}>{children}</body>
        </html>
    );
}
