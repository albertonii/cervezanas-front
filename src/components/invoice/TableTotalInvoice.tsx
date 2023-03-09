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
      id: string;
      code: string;
      article: string;
      price: number;
      unit: number;
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

export function TableTotalInvoice({ data }: Props) {
  return (
    <View style={styles.page}>
      <ItemsTableTotalInvoice
        items={data.items}
        itemsHeaderTotal={data.itemsHeaderTotal}
      />
    </View>
  );
}
