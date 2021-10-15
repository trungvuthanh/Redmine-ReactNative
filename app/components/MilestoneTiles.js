import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import myFont from '../config/myFont';

export default function MilestoneTiles(props) {
  return (
    <View style={styles.tiles}>
      
    </View>
  );
}

const styles = StyleSheet.create({
  tiles: {
    backgroundColor: myFont.white,
    borderBottomColor: myFont.itemBorderColor,
    position: "relative",
    width: "100%",
    height: 92,
    backgroundColor: myFont.white,
    paddingHorizontal: 25,
    flexDirection: "row",
    borderStyle: "solid",
    borderBottomWidth: 0.5,
    borderBottomColor: myFont.itemBorderColor,
  },
})