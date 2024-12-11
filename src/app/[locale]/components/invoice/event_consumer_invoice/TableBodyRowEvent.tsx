// src/app/[locale]/components/invoice/event_consumer_invoice/TableBodyRowEvent.tsx

'use client';

import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { formatCurrency } from '@/utils/formatCurrency';

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
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: beerColors.border,
        backgroundColor: '#FFFFFF', // Fondo blanco para limpieza
    },
    cell: {
        flex: 1,
        padding: 8,
        fontSize: 10,
        color: beerColors.text,
        textAlign: 'left',
    },
    alternateRow: {
        backgroundColor: '#F9F9F9', // Fondo gris claro para filas alternadas
    },
    noDataRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: beerColors.border,
        backgroundColor: '#FFFFFF',
    },
    noDataCell: {
        flex: 1,
        padding: 8,
        fontSize: 10,
        color: beerColors.text,
        textAlign: 'center',
    },
});

interface Props {
    items:
        | {
              id: string | undefined;
              code: string;
              article: string | undefined;
              price: number | undefined;
              quantity: number | undefined;
              total: number | undefined;
          }[]
        | undefined;
}

export function TableBodyRowEvent({ items }: Props) {
    if (!items || items.length === 0) {
        return (
            <View style={styles.noDataRow}>
                <Text style={styles.noDataCell}>
                    No hay productos en este Punto de Consumo.
                </Text>
            </View>
        );
    }

    return (
        <>
            {items.map((item, index) => (
                <View
                    style={[
                        styles.row,
                        index % 2 === 0 ? styles.alternateRow : styles.row, // Filas alternadas
                    ]}
                    key={item.id || item.code || index}
                >
                    <Text style={styles.cell}>{item.code}</Text>
                    <Text style={styles.cell}>{item.article}</Text>
                    <Text style={styles.cell}>
                        {formatCurrency(item.price)}
                    </Text>
                    <Text style={styles.cell}>{item.quantity}</Text>
                    <Text style={styles.cell}>
                        {formatCurrency(item.total)}
                    </Text>
                </View>
            ))}
        </>
    );
}
