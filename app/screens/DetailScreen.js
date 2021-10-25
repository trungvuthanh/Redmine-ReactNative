import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import myFont from '../config/myFont';

export default function DetailScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
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
          onPress={() => navigation.push("AddScreen")}
          style={({pressed}) => [
            {
              backgroundColor: pressed
                ? myFont.buttonPressedColor
                : myFont.addButtonColor
            },
            styles.editButton
          ]}
        >
          {/* <Ionicons name="add" size={40} color={myFont.white} /> */}
          <Text style={{fontSize: 10.4, color: myFont.white}}>EDIT</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  editButton: {
    height: 50,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: myFont.addButtonColor,
  },
  backButton: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
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
})