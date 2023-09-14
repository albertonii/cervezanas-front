import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { formatCurrency } from "../../../../utils/formatCurrency";

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },
  data_cod: {
    width: "15%",
    height: "100%",
    border: "1px solid black",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
    textAlign: "left",
  },
  data_article: {
    width: "55%",
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
  data_price: {
    width: "10%",
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
  data_unit: {
    width: "10%",
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
  data_total: {
    width: "10%",
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
    code: string;
    article: string;
    price: number;
    unit: number;
    total: number;
  }[];
}

export function TableBodyRow({ items }: Props) {
  const rows = items.map((item) => (
    <View style={styles.row} key={item.code}>
      <Text style={styles.data_cod}>{item.code}</Text>
      <Text style={styles.data_article}>{item.article}</Text>
      <Text style={styles.data_price}>{formatCurrency(item.price)}</Text>
      <Text style={styles.data_unit}>{item.unit}</Text>
      <Text style={styles.data_total}>{item.total}</Text>
    </View>
  ));
  return <>{rows}</>;
}
