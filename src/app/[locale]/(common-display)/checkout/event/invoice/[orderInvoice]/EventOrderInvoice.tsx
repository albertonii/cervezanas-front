// src/app/[locale]/components/invoice/EventOrderInvoice.tsx

'use client';

import React from 'react';
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
    PDFViewer,
} from '@react-pdf/renderer';
import { formatDateString } from '@/utils/formatDate';
import { IEventOrder } from '@/lib/types/eventOrders';
import { FooterInvoice } from '@/app/[locale]/components/invoice/FooterInvoice';
import { ItemsTableEvent } from '@/app/[locale]/components/invoice/event_consumer_invoice/ItemsTableEvent';
import { TableTotalInvoiceEvent } from '@/app/[locale]/components/invoice/event_consumer_invoice/TableTotalInvoicoEvent';

const beerColors = {
    primary: '#FBB040', // Dorado
    secondary: '#D48806', // Ámbar
    accent: '#A65C00', // Marrón oscuro
    background: '#FFFFFF', // Blanco
    text: '#333333', // Gris oscuro para texto
    border: '#E0E0E0', // Gris claro para bordes
    shadow: 'rgba(0, 0, 0, 0.1)', // Sombra sutil
};

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: beerColors.background,
        color: beerColors.text,
        fontFamily: 'Helvetica',
        padding: 20,
    },
    viewer: {
        width: '100%',
        height: '100vh',
    },
    container: {
        flexDirection: 'column',
        margin: 0,
        padding: 0,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 100,
        height: 80,
    },
    companyInfo: {
        textAlign: 'right',
    },
    companyName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: beerColors.accent,
    },
    companyDetails: {
        fontSize: 10,
        lineHeight: 1.5,
        color: beerColors.text,
    },
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: beerColors.border,
        marginVertical: 10,
    },
    billingInfo: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#F9F9F9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: beerColors.border,
    },
    billingTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
        color: beerColors.accent,
    },
    billingDetails: {
        fontSize: 10,
        lineHeight: 1.5,
        color: beerColors.text,
    },
    invoiceDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    invoiceDetailItem: {
        fontSize: 10,
        color: beerColors.text,
    },
    eventSection: {
        marginBottom: 20,
    },
    eventTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: beerColors.accent,
        marginBottom: 10,
    },
    pcContainer: {
        flexDirection: 'column',
        backgroundColor: '#FDF6E3', // Beige claro
        borderRadius: 8,
        borderWidth: 1,
        borderColor: beerColors.border,
        padding: 10,
        marginBottom: 15,
    },
    pcTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: beerColors.secondary,
        marginBottom: 8,
    },
    note: {
        fontSize: 10,
        color: beerColors.text,
        marginBottom: 10,
    },
});

interface Props {
    order: IEventOrder;
}

export default function EventOrderInvoice({ order }: Props) {
    return (
        <PDFViewer style={styles.viewer}>
            <Document
                title={`recipe_${order.id}`}
                author={`cervezanas_pdf_creator`}
                subject={`order details with product purchased, shipping and billing information and more details`}
                keywords={`order, recipe, invoice, pdf, cervezanas`}
                language={`es-ES`}
            >
                <Page
                    size="A4"
                    style={styles.page}
                    orientation={'portrait'}
                    wrap
                >
                    <View style={styles.container}>
                        {/* Encabezado con Logo e Información de la Empresa */}
                        <View style={styles.header}>
                            <Image src="/assets/logo.png" style={styles.logo} />
                            <View style={styles.companyInfo}>
                                <Text style={styles.companyName}>
                                    Cervezanas M&M S.L
                                </Text>
                                <Text style={styles.companyDetails}>
                                    Calle Cañón del Río Lobos 7C, 1ºA. Madrid.
                                    28030. España
                                </Text>
                                <Text style={styles.companyDetails}>
                                    CIF B88139878
                                </Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        {/* Información de Facturación */}
                        <View style={styles.billingInfo}>
                            <Text style={styles.billingTitle}>
                                Datos de Facturación
                            </Text>
                            <Text style={styles.billingDetails}>
                                Nombre:{' '}
                                {order.guest_email
                                    ? 'Usuario invitado'
                                    : `${order.users?.name || ''} ${
                                          order.users?.lastname || ''
                                      }`}
                            </Text>
                            <Text style={styles.billingDetails}>
                                Email:{' '}
                                {order.guest_email || order.users?.email || ''}
                            </Text>
                            {/* Agrega más información de facturación si es necesario */}
                        </View>

                        {/* Detalles de la Factura */}
                        <View style={styles.invoiceDetails}>
                            <View>
                                <Text style={styles.invoiceDetailItem}>
                                    Nº Factura: {order.order_number}
                                </Text>
                                <Text style={styles.invoiceDetailItem}>
                                    Fecha: {formatDateString(order.created_at)}
                                </Text>
                            </View>
                            {/* Puedes agregar más detalles de la factura aquí */}
                        </View>

                        <View style={styles.divider} />

                        {/* Información del Evento */}
                        <View style={styles.eventSection}>
                            <Text style={styles.eventTitle}>
                                Evento: {order.events?.name || 'N/A'}
                            </Text>

                            {/* Iterar sobre cada Punto de Consumo */}
                            {order.event_order_cps?.map((cp, index) => (
                                <View
                                    style={styles.pcContainer}
                                    key={cp.id || index}
                                >
                                    <Text style={styles.pcTitle}>
                                        Punto de Consumo:{' '}
                                        {cp.cp_events?.cp_name || 'N/A'}
                                    </Text>
                                    <ItemsTableEvent
                                        items={cp.event_order_items?.map(
                                            (item) => ({
                                                id: item.product_packs
                                                    ?.product_id,
                                                code: order.order_number, // Suponiendo que el código es el número de orden
                                                article:
                                                    item.product_packs?.name,
                                                price: item.product_packs
                                                    ?.price,
                                                quantity: item.quantity,
                                                total:
                                                    item.quantity *
                                                    (item.product_packs
                                                        ?.price || 0),
                                            }),
                                        )}
                                        itemsHeader={[
                                            { title: 'Código' },
                                            { title: 'Artículo' },
                                            { title: 'Precio' },
                                            { title: 'Unidad' },
                                            { title: 'Total' },
                                        ]}
                                    />
                                </View>
                            ))}

                            {/* Tabla de Totales de la Factura */}
                            <TableTotalInvoiceEvent
                                taxableIncome={order.subtotal}
                                tax={order.tax}
                                discount={order.discount}
                                totalInvoice={order.total}
                            />

                            {/* Pie de Página */}
                            <FooterInvoice />
                        </View>
                    </View>
                </Page>
            </Document>
        </PDFViewer>
    );
}
