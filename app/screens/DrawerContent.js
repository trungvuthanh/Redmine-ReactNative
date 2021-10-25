import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItem
} from '@react-navigation/drawer';

export default function DrawerContent(props) {
  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView>
        <View><Text>abc</Text></View>
      </DrawerContentScrollView>
    </View>
  );
}