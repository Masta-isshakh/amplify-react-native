import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { generateClient } from "aws-amplify/data";
import { getUrl } from "aws-amplify/storage";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);


const client = generateClient();


export default function GalleryScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sub = client.models.Product.observeQuery().subscribe({
      next: async ({ items }) => {
        const withUrls = await Promise.all(
          items.map(async (item) => {
            try {
              const urlRes = await getUrl({ key: item.imagePath });
              return { ...item, imageUrl: urlRes.url.toString() };
            } catch {
              return { ...item, imageUrl: null };
            }
          })
        );
        setProducts(withUrls);
        setLoading(false);
      },
    });
    return () => sub.unsubscribe();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {products.map((p) => (
        <View key={p.id} style={styles.card}>
          {p.imageUrl && <Image source={{ uri: p.imageUrl }} style={styles.image} />}
          <Text style={styles.name}>{p.name}</Text>
          <Text>{p.description}</Text>
          <Text style={styles.price}>{p.price} QAR</Text>
          {p.oldPrice && <Text style={styles.oldPrice}>{p.oldPrice} QAR</Text>}
          {p.rate && <Text>⭐ {p.rate}</Text>}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  card: {
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  image: { width: "100%", height: 180, borderRadius: 10 },
  name: { fontSize: 16, fontWeight: "bold", marginTop: 6 },
  price: { color: "green", fontWeight: "bold" },
  oldPrice: { textDecorationLine: "line-through", color: "red" },
});
