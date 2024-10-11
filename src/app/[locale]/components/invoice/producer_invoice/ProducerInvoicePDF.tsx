import React from 'react';
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image,
} from '@react-pdf/renderer';
import { ISalesRecordsProducer } from '@/lib/types/types';

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 12,
        fontFamily: 'Helvetica',
        backgroundColor: '#F5F5F5', // Fondo gris claro
    },
    header: {
        marginBottom: 20,
        textAlign: 'center',
        color: '#8B4513', // Marrón
    },
    title: {
        fontSize: 26, // Tamaño más grande para destacar
        fontWeight: 'bold',
        color: '#DAA520', // Dorado
        marginBottom: 10,
    },
    period: {
        fontSize: 14,
        color: '#8B4513', // Marrón
        marginBottom: 20,
    },
    logosContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around', // Espacio entre los logos
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 70,
        height: 70,
    },
    gridContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    gridItem: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 5,
        border: '1pt solid #DAA520',
    },
    gridItemHeader: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#8B4513',
        marginBottom: 10,
    },
    textSmall: {
        fontSize: 10,
        color: '#555555', // Color más suave para texto pequeño
    },
    tableContainer: {
        marginTop: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#DAA520', // Fondo dorado en el encabezado
        padding: 8,
        color: '#FFFFFF',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottom: '1pt solid #EEEEEE',
        fontSize: 11, // Tamaño reducido para filas
    },
    tableColHeader: {
        width: '20%',
        fontWeight: 'bold',
        fontSize: 12,
    },
    tableCol: {
        width: '20%',
        color: '#333333',
    },
    total: {
        marginTop: 20,
        textAlign: 'right',
        fontWeight: 'bold',
        fontSize: 14,
        color: '#8B4513',
    },
    disclaimer: {
        marginTop: 30,
        fontSize: 10,
        textAlign: 'center',
        color: '#888888',
    },
    footer: {
        marginTop: 50,
        fontSize: 10,
        textAlign: 'center',
        color: '#888888',
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

    // Función para calcular el IVA (21%)
    const calculateIVA = (amount: number) => (amount * 0.21).toFixed(2);

    // Función para calcular el total de ventas con la comisión restada
    const calculateTotalWithCommission = (amount: number) =>
        (amount * 0.85).toFixed(2);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Encabezado con logos */}
                <View style={styles.logosContainer}>
                    <Image style={styles.logo} src="/assets/logo.png" />{' '}
                    {/* Logo CERVEZANAS */}
                    <Image
                        style={styles.logo}
                        src="/assets/fundacion-social-innolabs.jpg"
                    />{' '}
                    {/* Logo SocialInnolabs */}
                </View>

                {/* Título y periodo */}
                <View style={styles.header}>
                    <Text style={styles.title}>Registro de Ventas</Text>
                    <Text style={styles.period}>
                        Período: {sales_records.invoice_period}
                    </Text>
                </View>

                {/* Información del productor e información de facturación en grid */}
                <View style={styles.gridContainer}>
                    <View style={styles.gridItem}>
                        <Text style={styles.gridItemHeader}>
                            Información del Productor
                        </Text>
                        <Text>
                            Productor: {sales_records.producer_username}
                        </Text>
                        <Text>Email: {sales_records.producer_email}</Text>
                        <Text>
                            Fecha de emisión:{' '}
                            {new Date(
                                sales_records.created_at,
                            ).toLocaleDateString()}
                        </Text>
                    </View>

                    <View style={styles.gridItem}>
                        <Text style={styles.gridItemHeader}>
                            Datos de Facturación
                        </Text>
                        <Text>Nombre: Cervezanas M&M, S.L.</Text>
                        <Text>
                            Domicilio: C/ Cañón del Río Lobos 7C, 1ºA. 28030
                            Madrid
                        </Text>
                        <Text>CIF: B88139878</Text>
                    </View>
                </View>

                {/* Tabla de productos */}
                <View style={styles.tableContainer}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableColHeader}>Producto</Text>
                        <Text style={styles.tableColHeader}>Pack</Text>
                        <Text style={styles.tableColHeader}>Cantidad</Text>
                        <Text style={styles.tableColHeader}>Total</Text>
                        <Text style={styles.tableColHeader}>IVA (21%)</Text>
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
                                {calculateTotalWithCommission(item.total_sales)}{' '}
                                €
                            </Text>
                            <Text style={styles.tableCol}>
                                {calculateIVA(item.total_sales)} €
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Totales */}
                <View style={styles.total}>
                    <Text>
                        Total Ventas (después de comisión):{' '}
                        {sales_records_items
                            .reduce(
                                (sum, item) =>
                                    sum +
                                    parseFloat(
                                        calculateTotalWithCommission(
                                            item.total_sales,
                                        ),
                                    ),
                                0,
                            )
                            .toFixed(2)}{' '}
                        €
                    </Text>
                    <Text>
                        IVA Total:{' '}
                        {sales_records_items
                            .reduce(
                                (sum, item) =>
                                    sum +
                                    parseFloat(calculateIVA(item.total_sales)),
                                0,
                            )
                            .toFixed(2)}{' '}
                        €
                    </Text>
                    <Text>
                        Total con IVA:{' '}
                        {(
                            sales_records_items.reduce(
                                (sum, item) =>
                                    sum +
                                    parseFloat(
                                        calculateTotalWithCommission(
                                            item.total_sales,
                                        ),
                                    ),
                                0,
                            ) +
                            sales_records_items.reduce(
                                (sum, item) =>
                                    sum +
                                    parseFloat(calculateIVA(item.total_sales)),
                                0,
                            )
                        ).toFixed(2)}{' '}
                        €
                    </Text>
                </View>

                {/* Disclaimer */}
                <View style={styles.disclaimer}>
                    <Text>
                        * El precio final ya incluye la comisión del 15%
                        aplicada por CERVEZANAS sobre el precio de cada producto
                        vendido.
                    </Text>
                </View>

                {/* Pie de Página */}
                <View style={styles.footer}>
                    <Text>
                        Contacto Cervezanas: sales@cervezanas.beer | Tel: +34
                        687 859 655
                    </Text>
                </View>
            </Page>
        </Document>
    );
};

export default InvoicePDF;
