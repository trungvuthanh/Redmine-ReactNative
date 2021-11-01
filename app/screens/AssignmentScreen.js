import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Header from "../components/Header";
import ItemTiles from "../components/ItemTiles";
import myFont from '../config/myFont';
import Footer from "../components/Footer";

export default function AssignmentScreen({ route, navigation }) {
	return (
		<SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.toggleDrawer()}
          style={styles.menuContainer}
        >
          <View>
            <Ionicons name="ios-menu" size={myFont.menuIconSize} color="white" />
          </View>
        </Pressable>
        <Text style={styles.textHeader}>
          My assignments
          <Text style={{fontSize: 18.6, letterSpacing: myFont.letterSpace}}> ({route.params.amount}/{route.params.amount})</Text>
        </Text>
      </View>
      {/* <Header title="My assignments" amount={route.params.amount} /> */}
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
  header: {
		width: "100%",
		height: 50,
		backgroundColor: myFont.darkColor,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
	},
  menuContainer: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  textHeader: {
    color: myFont.white,
    fontSize: myFont.fontHomeHeaderSize,
		fontWeight: myFont.fontWeight,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    letterSpacing: myFont.letterSpace,
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