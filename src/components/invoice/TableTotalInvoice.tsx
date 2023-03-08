import React from "react";
import { StyleSheet, View } from "@react-pdf/renderer";
import { ItemsTableTotalInvoice } from ".";

const styles = StyleSheet.create({
  page: {
    fontSize: 10,
  },
});

interface Props {
  data: {
    items: {
      taxable_income: number;
      tax: number;
      discount: number;
      total_invoice: number;
    }[];
    itemsHeader: {
      title: string;
    }[];
  };
}

export function TableTotalInvoice({ data }: Props) {
  return (
    <View style={styles.page}>
      <ItemsTableTotalInvoice
        items={data.items}
        itemsHeader={data.itemsHeader}
      />
    </View>
  );
}
