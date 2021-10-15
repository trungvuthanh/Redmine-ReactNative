import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Dimensions, StatusBar, ScrollView } from 'react-native';

import Header from "../components/Header";
import ItemTiles from "../components/ItemTiles";
import myFont from '../config/myFont';
import Footer from "../components/Footer";

export default function ForthEndScreen(props) {
	return (
		<SafeAreaView style={styles.container}>
      <Header title="Forthcoming ends" amount="(6/6)" />
      <ScrollView></ScrollView>
      <Footer/>
    </SafeAreaView>
	);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});