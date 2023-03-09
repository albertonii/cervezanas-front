import React, { useState } from "react";
import { View, StyleSheet, Svg, Line, Text } from "@react-pdf/renderer";

export function FooterInvoice() {
  const styles = StyleSheet.create({
    footer: {
      width: "100%",
      position: "absolute",
      bottom: -200,
      flexDirection: "column",
    },
    pageNumber: {
      fontSize: 12,
      bottom: -10,
      right: 0,
      color: "#90470b",
      fontWeight: "bold",
    },
    footerTextContainer: {
      marginTop: 10,
      flexDirection: "row",
      justifyContent: "space-between",
    },
  });

  return (
    <View style={styles.footer} fixed>
      <Svg width="100%" height="10" viewBox="0 -10 0 0">
        <Line
          style={{ stroke: "#90470b", strokeWidth: 1 }}
          x1={0}
          x2={1000}
          y1={0}
          y2={0}
        />
      </Svg>

      <View style={styles.footerTextContainer}>
        <View>
          <Text style={{ fontSize: 9 }}>
            - Inscrita en el Registro Mercantil de Murcia: Tomo 2236, Libro 0,
            Folio 50, Hoja Mu-52949, Inscripcion 1ª 1 / 1 REI-RAEE: 004992
          </Text>

          <Text style={{ fontSize: 9 }}>
            - Periodo de devolución de 30 días desde la compra. Consulta
            condiciones en nuestra web.
          </Text>
        </View>

        <Text
          style={styles.pageNumber}
          render={({
            pageNumber,
            totalPages,
          }: {
            pageNumber: number;
            totalPages: number;
          }) => `${pageNumber} / ${totalPages}`}
        ></Text>
      </View>
    </View>
  );
}
