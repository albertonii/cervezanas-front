import React from 'react';
import { View, StyleSheet } from '@react-pdf/renderer';
import { TableBodyRowTotalInvoice } from './TableBodyRowTotalInvoice';
import { TableHeaderRowTotalInvoice } from './TableHeaderRowTotalInvoice';
import { TableBodyRowTotalInvoiceOlds } from './TableBodyRowTotalInvoiceOld';

const styles = StyleSheet.create({
    tableContainer: {
        flexDirection: 'column',
        border: '1px solid black',
        width: '100%',
        marginTop: 20,
        marginBottom: 20,
    },
});

interface Props {
    items: {
        id: string;
        code: string;
        article: string;
        price: number;
        quantity: number;
        total: number;
    }[];
    itemsHeaderTotal: {
        title: string;
    }[];
}

export function ItemsTableTotalInvoiceOld({ items, itemsHeaderTotal }: Props) {
    return (
        <View style={styles.tableContainer}>
            <TableHeaderRowTotalInvoice itemsHeaderTotal={itemsHeaderTotal} />
            <TableBodyRowTotalInvoiceOlds items={items} />
        </View>
    );
}
