import React from 'react';
import { View, StyleSheet } from '@react-pdf/renderer';
import { TableBodyRow } from './TableBodyRow';
import { TableHeaderRow } from './TableHeaderRow';
import { TableHeaderRowOld } from './TableHeaderRowOld';

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
    itemsHeader: {
        title: string;
    }[];
}

export function ItemsTableOld({ items, itemsHeader }: Props) {
    return (
        <View style={styles.tableContainer}>
            <TableHeaderRowOld itemsHeader={itemsHeader} />
            <TableBodyRow items={items} />
            {/*<TableFooter items={data.items} />*/}
        </View>
    );
}
