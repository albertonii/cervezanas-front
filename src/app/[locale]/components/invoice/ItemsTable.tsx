import React, { useState } from 'react';
import { StyleSheet, View } from '@react-pdf/renderer';
import { IBusinessOrder } from '@/lib/types/types';
import { TableBodyRow } from './TableBodyRow';

const styles = StyleSheet.create({
    page: {
        fontSize: 10,
    },
});

interface Props {
    bOrder: IBusinessOrder;
}

const itemsHeader = [
    {
        title: 'Código',
    },
    { title: 'Artículo' },
    { title: 'Precio' },
    { title: 'Unidad' },
    { title: 'Total' },
];

export function ItemsTable({ bOrder }: Props) {
    const [items, setItems] = useState(() => {
        const { order_items } = bOrder;

        if (!order_items) return [];

        return order_items.map((item) => {
            if (!item.product_packs)
                return {
                    id: '',
                    code: '',
                    article: '',
                    price: 0,
                    quantity: 0,
                    total: 0,
                };

            const { order_number: code } = bOrder.orders!;
            const { quantity } = item;
            const { product_id, name: article, price } = item.product_packs;

            const total = quantity * price;

            return {
                id: product_id,
                code,
                article,
                price,
                quantity,
                total,
            };
        });
    });

    return (
        <View style={styles.page}>
            <TableBodyRow items={items} />

            {/* <ItemsTable items={items} itemsHeader={itemsHeader} /> */}
        </View>
    );
}
