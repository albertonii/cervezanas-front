import React from "react";
import { View, StyleSheet } from "@react-pdf/renderer";
import { TableBodyRowTotalInvoice, TableHeaderRowTotalInvoice } from ".";

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: "column",
    border: "1px solid black",
    width: "100%",
    marginTop: 20,
    marginBottom: 20,
  },
});

interface Props {
  items: {
    taxable_income: number;
    tax: number;
    discount: number;
    total_invoice: number;
  }[];
  itemsHeader: {
    title: string;
  }[];
}

export function ItemsTableTotalInvoice({ items, itemsHeader }: Props) {
  return (
    <View style={styles.tableContainer}>
      <TableHeaderRowTotalInvoice itemsHeader={itemsHeader} />
      <TableBodyRowTotalInvoice items={items} />
    </View>
  );
}
