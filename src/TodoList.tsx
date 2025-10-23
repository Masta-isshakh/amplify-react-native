import type { Schema } from "../amplify/data/resource";
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import { Button, Text, TextInput, View } from "react-native";

const client = generateClient<Schema>();

export default function TodoList() {
  const [todos, setTodos] = useState<Schema["Todo"]["type"][]>([]);


  useEffect(() => {
    const sub = client.models.Todo.observeQuery().subscribe({
      next: ({ items }) => {
        setTodos([...items]);
      },
    });

    return () => sub.unsubscribe();
  }, []);

  const createTodo = async () => {
    await client.models.Todo.create({
      imagePath: "path/to/image.jpg",
      productName: "New Product",
      productPrice: 19.99,
      productOldprice: 29.99,
      rate: 4.5,
      isDone: false,
    });
    // no more manual refetchTodos required!
    // - fetchTodos()
  };

  return (
    <View>
      <Button title="add todo" onPress={createTodo}/>
        <View>
        {todos.map(({ id, imagePath, productName, productPrice, productOldprice,  rate }) => (
        <Text key={id}>{imagePath}</Text>
        ))}
        </View>
    </View>
  );
}