import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Pressable, Dimensions } from 'react-native';

import myFont from '../config/myFont';

const OPTIONS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

const WIDTH = Dimensions.get('window').width;

export default function DoneRatioPicker(props) {
  const onPressOption = (option) => {
    props.changeDoneRatioVisibility(false);
    props.setDoneRatio(option);
  }

  const options = OPTIONS.map((option, index) => {
    return (
      <Pressable
        key={index}
        onPress={() => onPressOption(option)}
        style={styles.option}
      >
        <Text>{option.toString()} %</Text>
      </Pressable>
    );
  });

  return (
    <TouchableOpacity
      onPress={() => props.changeDoneRatioVisibility(false)}
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
    bottom: 144,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
  },
})