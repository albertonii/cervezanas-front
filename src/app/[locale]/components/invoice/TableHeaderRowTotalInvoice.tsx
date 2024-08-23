import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%',
        backgroundColor: '#fdc300',
        color: '#90470b',
        fontSize: 12,
    },
    title_shipping_cost: {
        width: '25%',
        border: '1px solid black',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
        height: '100%',
        textAlign: 'right',
    },
    title_taxable_income: {
        width: '25%',
        border: '1px solid black',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
        height: '100%',
        textAlign: 'right',
    },
    title_tax: {
        width: '25%',
        border: '1px solid black',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
        height: '100%',
        textAlign: 'right',
    },
    title_discount: {
        width: '25%',
        border: '1px solid black',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
        height: '100%',
        textAlign: 'right',
    },
    title_total_invoice: {
        width: '25%',
        border: '1px solid black',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
        height: '100%',
        textAlign: 'right',
    },
});

interface Props {
    itemsHeaderTotal: {
        title: string;
    }[];
}

export function TableHeaderRowTotalInvoice({ itemsHeaderTotal }: Props) {
    return (
        <>
            <View style={styles.row}>
                <Text style={styles.title_taxable_income}>
                    {itemsHeaderTotal[0].title}
                </Text>
                <Text style={styles.title_shipping_cost}>
                    {itemsHeaderTotal[1].title}
                </Text>
                <Text style={styles.title_tax}>
                    {itemsHeaderTotal[2].title}
                </Text>
                <Text style={styles.title_discount}>
                    {itemsHeaderTotal[3].title}
                </Text>
                <Text style={styles.title_total_invoice}>
                    {itemsHeaderTotal[4].title}
                </Text>
            </View>
        </>
    );
}
