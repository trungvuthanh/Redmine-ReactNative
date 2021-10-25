import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import myFont from '../config/myFont';

export default () => {
  return (
    <View style={styles.footer}>
      <Pressable
        onPress={(pressed) => {}}
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
  );
};

const styles = StyleSheet.create({
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
    // width: 50,
    height: 50,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    height: 50,
    paddingHorizontal: 15,
    backgroundColor: myFont.addButtonColor,
  },
})