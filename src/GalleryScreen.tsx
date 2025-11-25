import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Button,
  TextInput,
  Dimensions
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { generateClient } from "aws-amplify/data";
import { getUrl } from "aws-amplify/storage";
import type { Schema } from "../amplify/data/resource";
import { getCurrentUser } from "aws-amplify/auth";
import { useAuthenticator } from "@aws-amplify/ui-react-native";


const client = generateClient<Schema>();

const { width: screenWidth } = Dimensions.get("window");

const carouselImages = [
  "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg",
  "https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg",
  "https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg",
  "https://images.pexels.com/photos/906150/pexels-photo-906150.jpeg"
]


const SignOutButton = () => {
  const { signOut } = useAuthenticator();

  return (
    <View style={styles.signoutbutton}>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
};


export default function GalleryScreen({ navigation }) {
  const [products, setProducts] = useState<Schema["Product"]["type"][]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategorie, setSelectedCategorie] = useState("All");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const user = await getCurrentUser();
        const role = user?.signInDetails?.loginId;

        if (user?.signInDetails?.loginId === "mastaisshakh@gmail.com") {
          setIsOwner(true);
        }
      } catch (err) {
        console.log("utilisateur non admin");
      }
    };
    checkUserRole();
  }, []);

  useEffect(() => {
    const sub = client.models.Product.observeQuery().subscribe({
      next: async ({ items }) => {
        const withUrls = await Promise.all(
          items.map(async (item) => {
            try {
              const urlRes = await getUrl({ path: item.imagePath! });
              return { ...item, imageUrl: urlRes.url.toString() };
            } catch {
              return { ...item, imageUrl: null };
            }
          })
        );
        setProducts(withUrls);
        setFilteredProducts(withUrls);

        const cats = withUrls.map((p) => p.category).filter((c) => c && c.trim() !== "").filter((value, index, self) => self.indexOf(value) === index);
        setCategories(["All", ...cats]);
        setLoading(false);
      },
      error: (err) => console.error("Erreur observeQuery:", err),
    });

    return () => sub.unsubscribe();
  }, []);

  const handleSearch = (text) => {
    setSearch(text);

    const filtered = products.filter((item) =>
      item.name.toLocaleLowerCase().includes(text.toLowerCase()));
    setFilteredProducts(filtered);
  };

  const filterByCategory = (cat) => {
    setSelectedCategorie(cat);

    if (cat === "All") {
      setFilteredProducts(products);
      return;
    }
    const filtered = products.filter((p) => p.category === cat);
    setFilteredProducts(filtered);
  };

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;

  return (

    <ScrollView>
      <View style={styles.searchcontainer}>
        <TouchableOpacity>
          <Image
            source={require("../assets/logo.jpeg")}
            style={styles.imagehead}
          />
        </TouchableOpacity>

        <TextInput
          placeholder="search products...."
          value={search}
          onChangeText={handleSearch}
          style={styles.searchinput}
        />
        <TouchableOpacity>
          <Image
            source={require("../assets/logo.jpeg")}
            style={styles.imagehead}
          />
        </TouchableOpacity>

      </View>
      <View style={styles.carouselContainer}>
        <Carousel
          width={screenWidth - 20}
          height={180}
          autoPlay={true}
          data={carouselImages}
          scrollAnimationDuration={1200}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.carouselimages} />
          )}
        />
      </View>
      {/* 🔥 Boutons de catégories horizontaux */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
      >
        {filteredProducts.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryButton,
              selectedCategorie === cat && styles.categoryButtonActive
            ]}
            onPress={() => filterByCategory(cat)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategorie === cat && styles.categoryTextActive
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.container}>
        {filteredProducts.map((p) => (

          <TouchableOpacity
            key={p.id}
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("ProductDetail", { product: p })}
          >
            {p.imageUrl && (
              <Image source={{ uri: p.imageUrl }} style={styles.image} />
            )}
            <Text style={styles.name}>{p.name}</Text>
            {p.description && <Text>{p.description}</Text>}
            <Text style={styles.price}>{p.price} QAR</Text>
            {p.oldPrice && (
              <Text style={styles.oldPrice}>{p.oldPrice} QAR</Text>
            )}
            {p.rate && <Text>⭐ {p.rate}</Text>}
          </TouchableOpacity>

        ))}
      </View>
      {/*bouton visible uniquement pour admin */}
      {isOwner && (
        <Button
          title="ajouter un produit"
          onPress={() => navigation.navigate("Upload")}
        />
      )}

      <SignOutButton />
    </ScrollView>




  );
}

const styles = StyleSheet.create({
  container: {

    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#f5f5f5"
  },
  carouselContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  imagehead: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  carouselimages: {
    width: "98%",
    alignItems: "center",
    justifyContent: "center",
    height: 180,
    borderRadius: 15,
    padding: 5
  },
  searchcontainer: {
    paddingHorizontal: 10,
    marginTop: 50,
    marginBottom: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

  },
  searchinput: {
    backgroundColor: "#fff",
    padding: 7,
    borderRadius: 10,
    fontSize: 13,
    elevation: 2,
    width: "70%",
    height: 40
  },
  card: {
    backgroundColor: "#fff",
    width: "48%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 80,
    borderRadius: 10,
    resizeMode: "contain",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 6,
  },

  price: {
    color: "green",
    fontWeight: "bold",
  },

  oldPrice: {
    textDecorationLine: "line-through",
    color: "red",
  },
  signoutbutton: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 70
  },
  categoryScroll: {
    marginTop: 10,
    paddingHorizontal: 10,
  },

  categoryButton: {
    backgroundColor: "#e5e5e5",
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    borderRadius: 20,
  },

  categoryButtonActive: {
    backgroundColor: "#4CAF50",
  },

  categoryText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },

  categoryTextActive: {
    color: "#fff",
  },

});
