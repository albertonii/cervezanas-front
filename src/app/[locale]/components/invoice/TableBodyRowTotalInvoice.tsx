import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%',
    },
    data_taxable_income: {
        width: '25%',
        height: '100%',
        border: '1px solid black',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        right: 0,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
        textAlign: 'left',
    },
    data_tax: {
        width: '25%',
        height: '100%',
        border: '1px solid black',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
        textAlign: 'right',
    },
    data_discount: {
        width: '25%',
        height: '100%',
        border: '1px solid black',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
        textAlign: 'right',
    },
    data_total_invoice: {
        width: '25%',
        height: '100%',
        border: '1px solid black',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
        textAlign: 'right',
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
}

export function TableBodyRowTotalInvoice({ items }: Props) {
    const taxRate = 21; // Tax rate in percentage
    const [taxableIncome, setTaxableIncome] = useState(0);
    const [totalTax, setTotalTax] = useState(0);
    const [totalInvoice, setTotalInvoice] = useState(0);

    useEffect(() => {
        const income = items.reduce((acc, item) => acc + item.total, 0);
        const tax = (income * taxRate) / 100;
        const total = income + tax;

        setTaxableIncome(income);
        setTotalTax(tax);
        setTotalInvoice(total);
    }, [items]);

    return (
        <View style={styles.row}>
            <Text style={styles.data_taxable_income}>
                {taxableIncome.toFixed(2)} EUR
            </Text>
            <Text style={styles.data_tax}>{totalTax.toFixed(2)} EUR</Text>
            <Text style={styles.data_discount}>0.00 EUR</Text>
            <Text style={styles.data_total_invoice}>
                {totalInvoice.toFixed(2)} EUR
            </Text>
        </View>
    );
}
