import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

const fruitData = [
  {
    name: 'Pomme',
    image: 'https://cdn.pixabay.com/photo/2014/02/01/17/28/apple-256261_1280.jpg',
    price: '1.99 € /kg',
    rating: 4.5,
  },
  {
    name: 'Banane',
    image: 'https://cdn.pixabay.com/photo/2014/02/01/17/28/apple-256261_1280.jpg',
    price: '1.50 € /kg',
    rating: 4.2,
  },
  {
    name: 'Fraise',
    image: 'https://cdn.pixabay.com/photo/2016/03/05/19/02/strawberries-1239425_1280.jpg',
    price: '3.50 € /barquette',
    rating: 4.8,
  },
  {
    name: 'Orange',
    image: 'https://cdn.pixabay.com/photo/2017/01/20/15/06/oranges-1995056_1280.jpg',
    price: '2.00 € /kg',
    rating: 4.1,
  },
  {
    name: 'Kiwi',
    image: 'https://cdn.pixabay.com/photo/2016/03/05/19/02/kiwi-1239426_1280.jpg',
    price: '2.80 € /kg',
    rating: 4.6,
  },
  {
    name: 'Mangue',
    image: 'https://cdn.pixabay.com/photo/2016/05/18/16/34/mango-1400145_1280.jpg',
    price: '4.20 € /kg',
    rating: 4.9,
  },
  {
    name: 'Pastèque',
    image: 'https://cdn.pixabay.com/photo/2018/06/28/17/14/watermelon-3506048_1280.jpg',
    price: '1.80 € /kg',
    rating: 4.4,
  },
  {
    name: 'Ananas',
    image: 'https://cdn.pixabay.com/photo/2016/03/05/22/15/pineapple-1239429_1280.jpg',
    price: '3.00 € /pièce',
    rating: 4.7,
  },
  {
    name: 'Cerise',
    image: 'https://cdn.pixabay.com/photo/2018/06/27/18/28/cherries-3503075_1280.jpg',
    price: '5.00 € /barquette',
    rating: 4.3,
  },
  // Ajoute encore 10 fruits ou plus si besoin
];

const numColumns = 3;
const screenWidth = Dimensions.get('window').width;
const itemSize = screenWidth / numColumns - 20;

const Fruits = ({searchQuery = ''}) => {
    const filteredFruitsn= fruitData.filter((fruit)=>
    fruit.name.toLowerCase().includes(searchQuery.toLowerCase())
);
  const renderItem = ({ item }) => (
    <View style={[styles.card, { width: itemSize }]}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>{item.price}</Text>
      <Text style={styles.rating}>⭐ {item.rating}</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Ajouter au panier</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={fruitData}
      renderItem={renderItem}
      keyExtractor={(item, index) => item.name + index}
      numColumns={numColumns}
      contentContainerStyle={styles.list}
    />
  );
};

export default Fruits;

const styles = StyleSheet.create({
  list: {
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    margin: 5,
    borderRadius: 10,
    padding: 8,
    elevation: 2,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 80,
    borderRadius: 8,
  },
  name: {
    fontWeight: 'bold',
    marginTop: 5,
    fontSize: 14,
  },
  price: {
    color: 'green',
    fontSize: 12,
  },
  rating: {
    fontSize: 12,
    color: '#ff9800',
  },
  button: {
    marginTop: 5,
    backgroundColor: 'orange',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  buttonText: {
    fontSize: 12,
    color: '#fff',
  },
});
