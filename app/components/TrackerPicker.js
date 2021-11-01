import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Pressable, Dimensions } from 'react-native';

import myFont from '../config/myFont';

const OPTIONS = [{name: 'Bug', id: 1}, {name: 'Feature', id: 2}, {name: 'Support', id: 3}];

const WIDTH = Dimensions.get('window').width;

export default function TrackerPicker(props) {
  const onPressOption = (option) => {
    props.changeTrackerVisibility(false);
    props.setTracker(option);
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
      onPress={() => props.changeTrackerVisibility(false)}
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
    alignItems: "flex-start",
    justifyContent: "flex-end",
  },
  modal: {
    width: WIDTH * 0.4,
    maxWidth: 180,
    backgroundColor: "#f7f7f8",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#cccccc80",
    left: 10,
    bottom: 147,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
  },
})