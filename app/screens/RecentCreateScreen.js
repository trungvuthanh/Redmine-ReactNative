import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Dimensions, StatusBar, ScrollView } from 'react-native';

import Header from "../components/Header";
import ItemTiles from "../components/ItemTiles";
import myFont from '../config/myFont';
import Footer from "../components/Footer";

export default function RecentCreateScreen(props) {
	return (
		<SafeAreaView style={styles.container}>
      <Header title="Recently created projects" amount="(6/6)" />
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