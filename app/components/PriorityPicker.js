import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Pressable, Dimensions } from 'react-native';

import myFont from '../config/myFont';

const OPTIONS = [
  {name: 'Low', id: 1}, 
  {name: 'Normal', id: 2}, 
  {name: 'High', id: 3}, 
  {name: 'Urgent', id: 4}, 
  {name: 'Immediate', id: 5}
];

const WIDTH = Dimensions.get('window').width;

export default function PriorityPicker(props) {
  const onPressOption = (option) => {
    props.changePriorityVisibility(false);
    props.setPriority(option);
  }

  const options = OPTIONS.map((option, index) => {
    return (
      <Pressable
        key={index}
        onPress={() => onPressOption(option)}
        style={styles.option}
      >
        <Text>{option.name}</Text>
      </Pressable>
    );
  });

  return (
    <TouchableOpacity
      onPress={() => props.changePriorityVisibility(false)}
      style={styles.container}
    >
      <View style={styles.modal}>
        <ScrollView>
          {options}
        </ScrollView>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    width: WIDTH * 0.4,
    maxWidth: 180,
    backgroundColor: "#f7f7f8",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#cccccc80",
    marginLeft: "40%",
    marginBottom: 10,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
  },
})