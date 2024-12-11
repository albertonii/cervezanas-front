'use client';

import React from 'react';
import { View, StyleSheet } from '@react-pdf/renderer';
import { TableHeaderRowEvent } from './TableHeaderRowEvent';
import { TableBodyRowEvent } from './TableBodyRowEvent';

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
    tableContainer: {
        flexDirection: 'column',
        backgroundColor: beerColors.background,
        borderRadius: 8,
        boxShadow: `0 2px 4px ${beerColors.shadow}`,
        border: `1px solid ${beerColors.border}`,
        width: '100%',
        marginTop: 10,
        marginBottom: 10,
        padding: 5,
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
    itemsHeader: {
        title: string;
    }[];
}

export function ItemsTableEvent({ items, itemsHeader }: Props) {
    return (
        <View style={styles.tableContainer}>
            <TableHeaderRowEvent itemsHeader={itemsHeader} />
            <TableBodyRowEvent items={items} />
        </View>
    );
}
