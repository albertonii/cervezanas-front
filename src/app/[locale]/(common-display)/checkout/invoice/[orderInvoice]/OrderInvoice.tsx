'use client';

import React from 'react';
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    PDFViewer,
    Image,
    Svg,
    Line,
} from '@react-pdf/renderer';
import { IBusinessOrder, IOrder } from '@/lib/types/types';
import { formatDateString } from '@/utils/formatDate';
import { TableTotalInvoice } from '@/app/[locale]/components/invoice/TableTotalInvoice';
import { FooterInvoice } from '@/app/[locale]/components/invoice/FooterInvoice';
import { TableHeaderRow } from '@/app/[locale]/components/invoice/TableHeaderRow';
import { ItemsTable } from '@/app/[locale]/components/invoice/ItemsTable';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4',
        color: 'black',
    },
    container: {
        flexDirection: 'column',
        margin: 20,
        padding: 10,
    },
    section: {
        flexGrow: 1,
        fontSize: 10,
        alignItems: 'flex-end',
    },
    viewer: {
        width: '100%',
        height: '100vh',
        // width: window.innerWidth, //the pdf viewer will take up all of the width and height
        // height: window.innerHeight,
    },
    logo: {
        width: 90,
        height: 80,
    },
    row_1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    row_2: {
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    billing_info_container: {},
    billing_info_title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    billing_info_container_data: {
        width: 300,
        marginTop: 10,
        fontSize: 10,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        lineHeight: 1.3,
        border: '1px solid #000',
        padding: 10,
    },
    recipe_container: {
        flexDirection: 'row',
        fontSize: 10,
        marginTop: 20,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        lineHeight: 1.3,
        border: '1px solid #000',
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 20,
        paddingRight: 20,
    },
    delivery_note_container: {
        flexDirection: 'row',
        fontSize: 10,
        marginTop: 20,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        lineHeight: 1.3,
        border: '1px solid #000',
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 20,
        paddingRight: 20,
    },
    tableContainer: {
        flexDirection: 'column',
        border: '1px solid black',
        width: '100%',
        marginTop: 20,
        marginBottom: 20,
    },
});

interface Props {
    bOrders: IBusinessOrder[];
}

export default function OrderInvoice({ bOrders }: Props) {
    const order = bOrders[0].orders as IOrder;

    return (
        <>
            <PDFViewer style={styles.viewer}>
                <Document
                    title={`recipe_${order.id}`}
                    author={`cervezanas_pdf_creator`}
                    subject={`order details with product purchased, shipping and billing information and more details`}
                    keywords={`order, recipe, invoice, pdf, cervezanas`}
                    language={`en-US`} // Get from user LOCALE
                >
                    <Page
                        size="A4"
                        style={styles.page}
                        orientation={'portrait'}
                        wrap
                    >
                        <View style={styles.container}>
                            <View style={styles.row_1}>
                                <View style={styles.section}>
                                    <Image
                                        src="/assets/logo.png"
                                        fixed
                                        style={styles.logo}
                                    />
                                </View>

                                <View style={styles.section}>
                                    <Text>Cervezanas M&M S.L</Text>
                                    <Text>
                                        Calle Cañón del Río Lobos 7C, 1ºA.
                                        Madrid. 28030. España
                                    </Text>
                                    <Text>CIF B88139878</Text>
                                    <Svg
                                        width="444"
                                        height="100"
                                        viewBox="0 -10 0 0"
                                    >
                                        <Line
                                            style={{
                                                stroke: '#90470b',
                                                strokeWidth: 2,
                                            }}
                                            x1={0}
                                            x2={444}
                                            y1={0}
                                            y2={0}
                                        />
                                    </Svg>
                                </View>
                            </View>

                            <View style={styles.row_2}>
                                {order && (
                                    <View style={styles.billing_info_container}>
                                        <Text style={styles.billing_info_title}>
                                            Albarán de entrega
                                        </Text>

                                        <View
                                            style={
                                                styles.billing_info_container_data
                                            }
                                        >
                                            <Text>
                                                Nombre: {order.billing_name}
                                            </Text>
                                            <Text>
                                                Dirección:{' '}
                                                {order.billing_address},{' '}
                                                {order.billing_city}.
                                            </Text>
                                            <Text>
                                                Población:{' '}
                                                {order.billing_sub_region} -{' '}
                                                {order.billing_region}.{' '}
                                                {order.billing_country}.{' '}
                                                {order.billing_zipcode}
                                            </Text>
                                            <Text>
                                                NIF/CIF:{' '}
                                                {order.billing_document_id}
                                            </Text>
                                            <Text>
                                                Teléfono: {order.billing_phone}
                                            </Text>
                                        </View>
                                    </View>
                                )}

                                {/* Nº factura; fecha; forma de pago */}
                                <View style={styles.recipe_container}>
                                    <Text>Nº pedido: {order.order_number}</Text>
                                    <Text>
                                        Fecha:{' '}
                                        {formatDateString(
                                            order.issue_date.toString(),
                                        )}
                                    </Text>
                                    {/* <Text>Forma de pago: {order.payment_method_card?.type}</Text> */}
                                </View>

                                {/* Products table of the order */}
                                <View style={styles.tableContainer}>
                                    <TableHeaderRow />

                                    {bOrders.map((bOrder) => (
                                        <ItemsTable bOrder={bOrder} />
                                    ))}
                                </View>

                                {/* Total Invoice  */}
                                <TableTotalInvoice bOrders={bOrders} />

                                {/* Footer */}
                                <FooterInvoice />
                            </View>
                        </View>
                    </Page>
                </Document>
            </PDFViewer>
        </>
    );
}
