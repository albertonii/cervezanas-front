import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";

import { Order, Product } from "../../../lib/types";
import { GetServerSidePropsContext } from "next";
import { supabase } from "../../../utils/supabaseClient";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
    color: "black",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  viewer: {
    width: "100%",
    height: "100vh",
    // width: window.innerWidth, //the pdf viewer will take up all of the width and height
    // height: window.innerHeight,
  },
});

interface Props {
  order: Order;
  products: Product[];
}

export default function OrderInvoice({ order, products }: Props) {
  return (
    <PDFViewer style={styles.viewer}>
      <Document
        title={`receipt_${order.id}`}
        author={`cervezanas_pdf_creator`}
        subject={`order details with product purchased, shipping and billing information and more details`}
        keywords={`order, receipt, invoice, pdf, cervezanas`}
        language={`en-US`} // Get from user LOCALE
      >
        <Page size="A4" style={styles.page} orientation={"portrait"}>
          <View style={styles.section}>
            <Text>Section #1</Text>
          </View>
          <View style={styles.section}>
            <Text>Section #2</Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const params = context.params as { orderInvoice: string };
  const { orderInvoice: orderId } = params;

  let { data: orderData, error: orderError } = await supabase
    .from("orders")
    .select(
      `
      *,
      shipping_info(id, *),
      billing_info(id, *),
      products(
        id, 
        name, 
        price,
        product_multimedia(*),
        order_item(*)
      )
    `
    )
    .eq("id", orderId);

  if (orderError) {
    throw new Error(orderError.message);
  }

  if (!orderData || orderData.length === 0) {
    return {
      props: {
        order: null,
      },
    };
  }

  return {
    props: {
      order: orderData[0],
      products: orderData[0].products,
    },
  };
}
