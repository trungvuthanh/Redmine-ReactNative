import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Header from "../components/Header";
import ToDoTiles from "../components/ToDoTiles";
import myFont from '../config/myFont';
import Footer from "../components/Footer";

export default function MyToDoScreen({ route, navigation }) {
	return (
		<SafeAreaView style={styles.container}>
      <Header title="My ToDo" amount={route.params.amount} />
      <ScrollView>
        <Text></Text>
      </ScrollView>
      {/* <Footer/> */}
      <View style={styles.footer}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({pressed}) => [
            {
              backgroundColor: pressed
                ? myFont.buttonPressedColor
                : myFont.footerBackgroundColor
            },
            styles.backButton
          ]}
        >
          <Ionicons name="chevron-back" size={30} color={myFont.blue} />
        </Pressable>
        <Pressable
          onPress={({pressed}) => {}}
          style={({pressed}) => [
            {
              backgroundColor: pressed
                ? myFont.buttonPressedColor
                : myFont.addButtonColor
            },
            styles.backButton
          ]}
        >
          <Ionicons name="add" size={40} color={myFont.white} />
        </Pressable>
      </View>
    </SafeAreaView>
	);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  footer: {
    backgroundColor: myFont.footerBackgroundColor,
    borderTopColor: myFont.footerBorderColor,
    width: "100%",
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 0,
  },
  backButton: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    height: 50,
    paddingHorizontal: 15,
    backgroundColor: myFont.addButtonColor,
  },
});