// src/app/[locale]/components/invoice/event_consumer_invoice/TableTotalInvoiceEvent.tsx

'use client';

import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { formatCurrency } from '@/utils/formatCurrency';

const styles = StyleSheet.create({
    totalsContainer: {
        flexDirection: 'column',
        alignSelf: 'flex-end',
        width: '40%',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 10,
        backgroundColor: '#fff', // Añadir un fondo blanco para que la sombra sea más visible
        borderRadius: 8, // Añadir bordes redondeados para un mejor efecto visual
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    label: {
        fontSize: 10,
        color: '#333333',
    },
    value: {
        fontSize: 10,
        color: '#333333',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
        backgroundColor: '#F5F5F5',
        borderBottomLeftRadius: 8, // Añadir bordes redondeados en la parte inferior
        borderBottomRightRadius: 8,
    },
    totalLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#333333',
    },
    totalValue: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#333333',
    },
});

interface Props {
    taxableIncome: number;
    tax: number;
    discount: number;
    totalInvoice: number;
}

export function TableTotalInvoiceEvent({
    taxableIncome,
    tax,
    discount,
    totalInvoice,
}: Props) {
    return (
        <View style={styles.totalsContainer}>
            <View style={styles.row}>
                <Text style={styles.label}>Base Imponible</Text>
                <Text style={styles.value}>
                    {formatCurrency(taxableIncome)}
                </Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>IVA/IGIC ({tax}%)</Text>
                <Text style={styles.value}>
                    {formatCurrency((taxableIncome * tax) / 100)}
                </Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Descuento</Text>
                <Text style={styles.value}>{formatCurrency(discount)}</Text>
            </View>
            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Factura</Text>
                <Text style={styles.totalValue}>
                    {formatCurrency(totalInvoice)}
                </Text>
            </View>
        </View>
    );
}
