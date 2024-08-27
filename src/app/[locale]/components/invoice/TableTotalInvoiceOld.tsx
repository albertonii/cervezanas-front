import React from 'react';
import { StyleSheet, View } from '@react-pdf/renderer';
import { ItemsTableTotalInvoice } from './ItemsTableTotalInvoice';
import { ItemsTableTotalInvoiceOld } from './ItemsTableTotalInvoiceOld';

const styles = StyleSheet.create({
    page: {
        fontSize: 10,
    },
});

interface Props {
    data: {
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
        itemsHeaderTotal: {
            title: string;
        }[];
    };
}

export function TableTotalInvoiceOld({ data }: Props) {
    return (
        <View style={styles.page}>
            <ItemsTableTotalInvoiceOld
                items={data.items}
                itemsHeaderTotal={data.itemsHeaderTotal}
            />
        </View>
    );
}
