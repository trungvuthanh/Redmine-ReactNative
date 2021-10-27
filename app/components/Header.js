import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import myFont from '../config/myFont';

export default (props) => {
  return (
    <View style={styles.header}>
      <View style={styles.menuContainer}>
        <Ionicons name="ios-menu" size={myFont.menuIconSize} color="white" />
      </View>
      <Text style={styles.textHeader}>
        {props.title}
        {!(props.amount == undefined)
          ? <Text style={{fontSize: 13, letterSpacing: myFont.letterSpace}}> ({props.amount}/{props.amount})</Text>
          : <></>}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
})