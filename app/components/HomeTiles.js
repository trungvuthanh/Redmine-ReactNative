import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

import myFont from '../config/myFont';

export default function HomeTiles(props) {
  return (
    <>
      {props.isClosed == "yes"
        ? <View style={styles.isClosed} />
        : <View style={[styles.isClosed, { backgroundColor: myFont.whiteMarkColor }]} />}
      <View style={styles.textBox}>
        <Text style={styles.text} >{props.title}</Text>
        <Text style={[
          styles.amount,
          {
            color: props.isClosed == "no"
              ? myFont.black
              : myFont.statusColor[4]
          }]}>
          {props.amount}
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  amount: {
    fontSize: myFont.fontDashboardSize,
    fontWeight: myFont.fontWeight,
    color: myFont.black,
  },
  isClosed: {
    width: 12,
    height: 44,
    backgroundColor: myFont.statusColor[4],
    position: "absolute",
  },
  text: {
    fontSize: myFont.fontDashboardSize,
    fontWeight: myFont.fontWeight,
    color: myFont.black,
  },
  textBox: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
    marginVertical: 10,
  },
  tiles: {
    position: "relative",
    width: "100%",
    height: 45,
    backgroundColor: myFont.white,
    paddingHorizontal: 25,
    flexDirection: "row",
    borderStyle: "dotted",
    borderBottomWidth: 1,
    borderBottomColor: myFont.homeTileColor,
  },
})