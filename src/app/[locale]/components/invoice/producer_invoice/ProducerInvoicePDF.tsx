// InvoicePDF.jsx
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { IInvoiceItem, IInvoiceProducer } from '@/lib/types/types';

// Opcional: Registrar fuentes personalizadas
// Font.register({ family: 'Roboto', src: 'path/to/roboto.ttf' });

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 12,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
    },
    invoiceInfo: {
        marginBottom: 20,
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottom: '1pt solid #EEE',
        paddingBottom: 5,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 5,
        borderBottom: '1pt solid #EEE',
    },
    tableColHeader: {
        width: '25%',
        fontWeight: 'bold',
    },
    tableCol: {
        width: '25%',
    },
    total: {
        marginTop: 20,
        textAlign: 'right',
        fontWeight: 'bold',
    },
});

interface Props {
    invoice: IInvoiceProducer;
}

const InvoicePDF = ({ invoice }: Props) => {
    const { invoice_items } = invoice;

    if (!invoice_items) {
        return <></>;
    }

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Encabezado */}
                <View style={styles.header}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                        Factura
                    </Text>
                    <Text>Período: {invoice.invoice_period}</Text>
                </View>

                {/* Información del productor */}
                <View style={styles.invoiceInfo}>
                    <Text>Productor: {invoice.producer_username}</Text>
                    <Text>Email: {invoice.producer_email}</Text>
                    <Text>
                        Fecha de emisión:{' '}
                        {new Date(invoice.created_at).toLocaleDateString()}
                    </Text>
                </View>

                {/* Tabla de productos */}
                <View>
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableColHeader}>Producto</Text>
                        <Text style={styles.tableColHeader}>Pack</Text>
                        <Text style={styles.tableColHeader}>Cantidad</Text>
                        <Text style={styles.tableColHeader}>Total</Text>
                    </View>
                    {invoice_items?.map((item) => (
                        <View style={styles.tableRow} key={item.id}>
                            <Text style={styles.tableCol}>
                                {item.product_name}
                            </Text>
                            <Text style={styles.tableCol}>
                                {item.product_pack_name}
                            </Text>
                            <Text style={styles.tableCol}>
                                {item.product_quantity}
                            </Text>
                            <Text style={styles.tableCol}>
                                {item.total_sales.toFixed(2)} €
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Totales */}
                <View style={styles.total}>
                    <Text>
                        Total Ventas: {invoice.total_amount.toFixed(2)} €
                    </Text>
                    <Text>
                        Comisión Plataforma:{' '}
                        {invoice_items
                            .reduce(
                                (sum, item) => sum + item.platform_commission,
                                0,
                            )
                            .toFixed(2)}{' '}
                        €
                    </Text>
                    <Text>
                        Ingresos Netos:{' '}
                        {(
                            invoice.total_amount -
                            invoice_items.reduce(
                                (sum, item) => sum + item.platform_commission,
                                0,
                            )
                        ).toFixed(2)}{' '}
                        €
                    </Text>
                </View>
            </Page>
        </Document>
    );
};

export default InvoicePDF;
