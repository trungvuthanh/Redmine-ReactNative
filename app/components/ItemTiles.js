import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import myFont from '../config/myFont';

export default function ItemTiles(props) {
  const status = props.status;
  return (
    <View style={styles.tiles}>
      <View style={styles.box}>
        <View style={styles.status}>
          <MaterialCommunityIcons
            name="circle"
            size={30}
            color={myFont.statusColor[props.status]}
          />
        </View>
        <View style={styles.content}>
          <Text style={{fontSize: 14.3}}>{props.name}</Text>
          <Text style={{fontSize: 12}}>({props.id})</Text>
          <Text style={{fontSize: 10.4}}>START: {props.date}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 2,
  },
  content: {
    backgroundColor: myFont.white,

  },
  status: {
    width: 48,
    height: 45,
    alignItems: "center",
    backgroundColor: myFont.white,
  },
  tiles: {
    position: "relative",
    width: "100%",
    height: 70,
    backgroundColor: myFont.white,
    paddingVertical: 10,
    paddingLeft: 10,
    flexDirection: "row",
    borderStyle: "solid",
    borderBottomWidth: 0.5,
    borderBottomColor: myFont.itemBorderColor,
    alignItems: "center",
  },
})