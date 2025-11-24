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
} from "react-native";
import { generateClient } from "aws-amplify/data";
import { getUrl } from "aws-amplify/storage";
import type { Schema } from "../amplify/data/resource";
import { getCurrentUser } from "aws-amplify/auth";
import { useAuthenticator } from "@aws-amplify/ui-react-native";

const client = generateClient<Schema>();


const SignOutButton=()=>{
    const {signOut}=useAuthenticator();

    return (
        <View style={styles.signoutbutton}>
            <Button title="Sign Out" onPress={signOut}/>
        </View>
    );
};


export default function GalleryScreen({navigation}) {
  const [products, setProducts] = useState<Schema["Product"]["type"][]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(()=>{
    const checkUserRole = async()=>{
        try{
            const user=await getCurrentUser();
            const role=user?.signInDetails?.loginId;

            if (user?.signInDetails?.loginId === "mastaisshakh@gmail.com") {
                setIsOwner(true);
            }
        }catch(err){
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
        setLoading(false);
      },
      error: (err) => console.error("Erreur observeQuery:", err),
    });

    return () => sub.unsubscribe();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;

  return (
    
    <ScrollView>
        <View style={styles.container}>
      {products.map((p) => (
        
        <TouchableOpacity 
        key={p.id} 
        style={styles.card}
        activeOpacity={0.7}
        onPress={()=> navigation.navigate("ProductDetail", {product: p})}
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
      {isOwner&& (
        <Button
            title="ajouter un produit"
            onPress={()=> navigation.navigate("Upload")}
        />
      )}

      <SignOutButton/>
    </ScrollView>

    
    
    
  );
}

const styles = StyleSheet.create({
  container: { 
    flexDirection:"row",
    flexWrap:"wrap",
    justifyContent:"space-between",
    padding: 10, 
    backgroundColor: "#f5f5f5" 
},
  card: {
    backgroundColor: "#fff",
    width: "48%",
    shadowColor:"#000",
    shadowOpacity:0.1,
    shadowRadius:5,
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
      signoutbutton:{
        alignItems:"center",
        justifyContent:"center",
        marginBottom:70
    }
});
