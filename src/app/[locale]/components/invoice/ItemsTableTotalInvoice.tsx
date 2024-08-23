import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from '@react-pdf/renderer';
import { TableBodyRowTotalInvoice } from './TableBodyRowTotalInvoice';
import { TableHeaderRowTotalInvoice } from './TableHeaderRowTotalInvoice';
import { IBusinessOrder, IOrder, IOrderItem } from '@/lib/types/types';

const styles = StyleSheet.create({
    tableContainer: {
        flexDirection: 'column',
        border: '1px solid black',
        width: '100%',
        marginTop: 20,
        marginBottom: 20,
    },
});

const itemsHeaderTotal = [
    {
        title: 'Base Imponible',
    },
    {
        title: 'Coste de Envío',
    },
    {
        title: 'IVA/IGIC',
    },
    {
        title: 'Descuento',
    },
    {
        title: 'Total Factura',
    },
];

interface Props {
    bOrders: IBusinessOrder[];
}

export function ItemsTableTotalInvoice({ bOrders }: Props) {
    const shippingCost = bOrders[0].orders?.shipping || 0;

    const [items, setItems] = useState<
        {
            id: string;
            code: string;
            article: string;
            price: number;
            quantity: number;
            total: number;
        }[]
    >([]);

    useEffect(() => {
        const newItems: {
            id: string;
            code: string;
            article: string;
            price: number;
            quantity: number;
            total: number;
        }[] = [];

        bOrders.forEach((bOrder) => {
            const { order_number: code } = bOrder.orders as IOrder;

            const items =
                bOrder.order_items?.map((item: IOrderItem) => {
                    if (!item.product_packs)
                        return {
                            id: '',
                            code,
                            article: '',
                            price: 0,
                            quantity: 0,
                            total: 0,
                        };

                    const { quantity } = item;
                    const {
                        product_id,
                        name: article,
                        price,
                    } = item.product_packs;

                    const total = quantity * price;

                    return {
                        id: product_id,
                        code,
                        article,
                        price,
                        quantity,
                        total,
                    };
                }) || []; // Asegúrate de que siempre sea un array

            newItems.push(...items);
        });

        setItems(newItems);

        return () => {};
    }, [bOrders]);

    return (
        <View style={styles.tableContainer}>
            <TableHeaderRowTotalInvoice itemsHeaderTotal={itemsHeaderTotal} />
            <TableBodyRowTotalInvoice
                items={items}
                shippingCost={shippingCost}
            />
        </View>
    );
}
