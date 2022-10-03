import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList } from 'react-native';
import { initializeApp } from'firebase/app';
import { getDatabase, push, ref, onValue, remove } from'firebase/database';

export default function App() {
  const [product, setProduct] = useState('');
  const [amount, setAmount]   = useState('');
  const [buys, setBuys]       = useState([]);

  const firebaseConfig = {
    apiKey:             "AIzaSyANchMFFXodFVDc1QObpmZMFIh8Y-aQlWA",
    authDomain:         "mobiiliohjelmointi-teht12.firebaseapp.com",
    projectId:          "mobiiliohjelmointi-teht12",
    storageBucket:      "mobiiliohjelmointi-teht12.appspot.com",
    messagingSenderId:  "552520535426",
    appId:              "1:552520535426:web:4a7396c2718180ecc1539b"
  };

  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);


  const saveItem = () => {
    push(    
      ref(database, 'items/'),     
      { 'product': product, 'amount': amount });
  }

  useEffect(() => {
    const itemsRef = ref(database, 'items/');
      onValue(itemsRef, (snapshot) => {
        const data = snapshot.val();
        setBuys(Object.values(data));
      })
  }, []);

  const deleteItem = (id) => {
    remove(
      ref(database, `items/${id}`)
    )
  }

  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "20%"
        }}
      />
    );
  };


  return (
    <View style={styles.container}>

      <TextInput placeholder='Product' style={{marginTop: 30, fontSize: 18, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(product) => setProduct(product)}
        value={product}/>

      <TextInput placeholder='Amount' style={{ marginTop: 5, marginBottom: 5,  fontSize:18, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(amount) => setAmount(amount)}
        value={amount}/>

      <Button onPress={saveItem} title="Save" /> 

      <Text style={{marginTop: 30, fontSize: 20}}>Shopping list</Text>

      <FlatList 
        keyExtractor={item => item.id.toString()} 
        renderItem={({item}) => 
          <View style={styles.listcontainer}>
            <Text style={{fontSize: 18}}>{item.product}, {item.amount}</Text>
            <Text style={{fontSize: 18, color: '#0000ff'}} onPress={() => deleteItem(item.id)}>  bought</Text>
          </View>} 
        data={buys} 
        ItemSeparatorComponent={listSeparator} 
      />    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   backgroundColor: '#fff',
   alignItems: 'center',
   justifyContent: 'center',
  },

  listcontainer: {
   flexDirection: 'row',
   backgroundColor: '#fff',
   alignItems: 'center'
  },
 });
