import React from "react";
import { View, StyleSheet } from "@react-pdf/renderer";
import { TableBodyRow, TableHeaderRow } from ".";
import { String } from "lodash";

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
    code: string;
    article: string;
    price: number;
    unit: number;
    total: number;
  }[];
  itemsHeader: {
    title: string;
  }[];
}

export function ItemsTable({ items, itemsHeader }: Props) {
  return (
    <View style={styles.tableContainer}>
      <TableHeaderRow itemsHeader={itemsHeader} />
      <TableBodyRow items={items} />
      {/*<TableFooter items={data.items} />*/}
    </View>
  );
}