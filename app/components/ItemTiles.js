import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import myFont from '../config/myFont';

export default function ItemTiles(props) {
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
        <View>
          <Text style={{fontSize: 17.6}}>{props.name}</Text>
          <Text style={{fontSize: 12}}>#{props.id}</Text>
          <Text style={{fontSize: 16, marginTop: 2}}>Created on: {props.date}</Text>
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
  status: {
    width: 48,
    height: 45,
    alignItems: "center",
  },
  tiles: {
    position: "relative",
    width: "100%",
    height: 87,
    paddingVertical: 10,
    paddingLeft: 14,
    flexDirection: "row",
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: myFont.itemBorderColor,
    alignItems: "center",
  },
})