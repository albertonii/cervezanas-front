// src/app/[locale]/components/invoice/event_consumer_invoice/TableHeaderRowEvent.tsx

'use client';

import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

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
        backgroundColor: beerColors.primary, // Dorado relacionado con la cerveza
        borderBottomWidth: 1,
        borderBottomColor: beerColors.border,
    },
    headerCell: {
        flex: 1,
        padding: 8,
        fontSize: 10,
        fontWeight: 'bold',
        color: beerColors.background, // Blanco para contraste
        textAlign: 'left',
    },
});

interface Props {
    itemsHeader: {
        title: string;
    }[];
}

export function TableHeaderRowEvent({ itemsHeader }: Props) {
    return (
        <View style={styles.row}>
            {itemsHeader.map((header, index) => (
                <Text style={styles.headerCell} key={index}>
                    {header.title}
                </Text>
            ))}
        </View>
    );
}
