// InvoicePDF.jsx
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { ISalesRecordsItem, ISalesRecordsProducer } from '@/lib/types/types';

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
    salesRecordsInfo: {
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
    sales_records: ISalesRecordsProducer;
}

const InvoicePDF = ({ sales_records }: Props) => {
    const { sales_records_items } = sales_records;

    if (!sales_records_items) {
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
                    <Text>Período: {sales_records.invoice_period}</Text>
                </View>

                {/* Información del productor */}
                <View style={styles.salesRecordsInfo}>
                    <Text>Productor: {sales_records.producer_username}</Text>
                    <Text>Email: {sales_records.producer_email}</Text>
                    <Text>
                        Fecha de emisión:{' '}
                        {new Date(
                            sales_records.created_at,
                        ).toLocaleDateString()}
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
                    {sales_records_items?.map((item) => (
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
                        Total Ventas: {sales_records.total_amount.toFixed(2)} €
                    </Text>
                    <Text>
                        Comisión Plataforma:{' '}
                        {sales_records_items
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
                            sales_records.total_amount -
                            sales_records_items.reduce(
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
