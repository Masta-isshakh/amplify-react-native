import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Fruits from './SubCategory/Fruits';
import Legumes from './SubCategory/Legumes';
import HommeCloth from './SubCategory/HommeCloth';
import ProduitLaitier from './SubCategory/ProduitLaitier';

const Products = ({route}) => {
  const {subCategory, category, searchQuery =''}=route.params;
  return (
    <View>
        {subCategory==='Fruits'?(
          <Fruits searchQuery={searchQuery}/>
        ): subCategory==='Légumes'?(
          <Legumes searchQuery={searchQuery}/>
        ): subCategory==='Produits laitiers'?(
          <ProduitLaitier searchQuery={searchQuery}/>
        ):subCategory==='Homme'?(
          <HommeCloth searchQuery={searchQuery}/>
        ):(
          <Text>incnnus</Text>
        )}
    </View>
  )
}

export default Products

const styles = StyleSheet.create({})