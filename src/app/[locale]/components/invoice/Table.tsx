import React from "react";
import { StyleSheet, View } from "@react-pdf/renderer";
import { ItemsTable } from "./ItemsTable";

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
      quantity: number;
      total: number;
    }[];
    itemsHeader: {
      title: string;
    }[];
  };
}

export function Table({ data }: Props) {
  return (
    <View style={styles.page}>
      <ItemsTable items={data.items} itemsHeader={data.itemsHeader} />
    </View>
  );
}