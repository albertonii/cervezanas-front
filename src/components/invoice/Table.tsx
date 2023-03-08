import React from "react";
import { StyleSheet, View } from "@react-pdf/renderer";
import { ItemsTable } from ".";

const styles = StyleSheet.create({
  page: {
    fontSize: 10,
  },
});

interface Props {
  data: {
    items: {
      code: number;
      article: string;
      price: number;
      unit: number;
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
