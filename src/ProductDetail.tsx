import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";

export default function ProductDetail({ route }) {
  const { product } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {product.imageUrl && (
        <Image source={{ uri: product.imageUrl }} style={styles.image} />
      )}

      <Text style={styles.name}>{product.name}</Text>

      {product.description && (
        <Text style={styles.description}>{product.description}</Text>
      )}

      <Text style={styles.price}>{product.price} QAR</Text>

      {product.oldPrice && (
        <Text style={styles.oldPrice}>{product.oldPrice} QAR</Text>
      )}

      {product.rate && <Text style={styles.rate}>⭐ {product.rate}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    marginBottom: 20,
    resizeMode: "contain",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
    color: "#444",
  },
  price: {
    fontSize: 22,
    color: "green",
    fontWeight: "bold",
    marginTop: 10,
  },
  oldPrice: {
    fontSize: 18,
    color: "red",
    textDecorationLine: "line-through",
    marginTop: 5,
  },
  rate: {
    fontSize: 20,
    marginTop: 10,
  },
});
