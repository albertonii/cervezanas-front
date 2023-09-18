import React, { useState } from "react";
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
    id: string;
    code: string;
    article: string;
    price: number;
    quantity: number;
    total: number;
  }[];
}

export function TableBodyRowTotalInvoice({ items }: Props) {
  const [tax, setTax] = useState(21);
  const [taxableIncome, setTaxableIncome] = useState(
    items.reduce((acc, item) => {
      return acc + item.total;
    }, 0)
  );

  const [totalInvoice, setTotalInvoice] = useState(
    taxableIncome + (taxableIncome * tax) / 100
  );

  // TODO: ADD DISCOUNT TO PRODUCT

  const rows = items.map((item, index) => (
    <View style={styles.row} key={index}>
      <Text style={styles.data_taxable_income}>{taxableIncome}</Text>
      <Text style={styles.data_tax}>{tax}</Text>
      <Text style={styles.data_discount}>0</Text>
      <Text style={styles.data_total_invoice}>{totalInvoice}</Text>
    </View>
  ));
  return <>{rows}</>;
}
