import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },
  data_taxable_income: {
    width: "25%",
    height: "100%",
    border: "1px solid black",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    right: 0,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
    textAlign: "left",
  },
  data_tax: {
    width: "25%",
    height: "100%",
    border: "1px solid black",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
    textAlign: "right",
  },
  data_discount: {
    width: "25%",
    height: "100%",
    border: "1px solid black",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
    textAlign: "right",
  },
  data_total_invoice: {
    width: "25%",
    height: "100%",
    border: "1px solid black",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
    textAlign: "right",
  },
});

interface Props {
  items: {
    taxable_income: number;
    tax: number;
    discount: number;
    total_invoice: number;
  }[];
}

export function TableBodyRowTotalInvoice({ items }: Props) {
  const rows = items.map((item, index) => (
    <View style={styles.row} key={index}>
      <Text style={styles.data_taxable_income}>{item.taxable_income}</Text>
      <Text style={styles.data_tax}>{item.tax}</Text>
      <Text style={styles.data_discount}>{item.discount}</Text>
      <Text style={styles.data_total_invoice}>{item.total_invoice}</Text>
    </View>
  ));
  return <>{rows}</>;
}
