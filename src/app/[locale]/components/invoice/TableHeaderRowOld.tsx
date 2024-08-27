import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%',
        backgroundColor: '#fdc300',
        color: '#90470b',
        fontSize: 11,
    },
    title_cod: {
        width: '15%',
        border: '1px solid black',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
        height: '100%',
    },
    title_article: {
        width: '55%',
        border: '1px solid black',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
        height: '100%',
    },
    title_price: {
        width: '10%',
        border: '1px solid black',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
        height: '100%',
    },
    title_unit: {
        width: '10%',
        border: '1px solid black',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
        height: '100%',
    },
    title_total: {
        width: '10%',
        border: '1px solid black',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
        height: '100%',
    },
});

interface Props {
    itemsHeader: {
        title: string;
    }[];
}

export function TableHeaderRowOld({ itemsHeader }: Props) {
    return (
        <>
            <View style={styles.row}>
                <Text style={styles.title_cod}>{itemsHeader[0].title}</Text>
                <Text style={styles.title_article}>{itemsHeader[1].title}</Text>
                <Text style={styles.title_price}>{itemsHeader[2].title}</Text>
                <Text style={styles.title_unit}>{itemsHeader[3].title}</Text>
                <Text style={styles.title_total}>{itemsHeader[4].title}</Text>
            </View>
        </>
    );
}
