import React from 'react';
import { IBusinessOrder } from '@/lib/types/types';
import { StyleSheet, View } from '@react-pdf/renderer';
import { ItemsTableTotalInvoice } from './ItemsTableTotalInvoice';

const styles = StyleSheet.create({
    page: {
        fontSize: 10,
    },
});

interface Props {
    bOrders: IBusinessOrder[];
}

export function TableTotalInvoice({ bOrders }: Props) {
    return (
        <View style={styles.page}>
            <ItemsTableTotalInvoice bOrders={bOrders} />
        </View>
    );
}
