import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Pressable, Dimensions } from 'react-native';

import myFont from '../config/myFont';

const OPTIONS = ['New', 'In Progress', 'Resolved', 'Feedback', 'Closed', 'Rejected'];

const WIDTH = Dimensions.get('window').width;

export default function StatusPicker(props) {
  const onPressOption = (option) => {
    props.changeModalVisibility(false);
    props.setStatus(option);
  }

  const options = OPTIONS.map((option, index) => {
    return (
      <Pressable
        key={index}
        onPress={() => onPressOption(index + 1)}
        style={styles.option}
      >
        <View style={[styles.icon, {backgroundColor: myFont.statusColor[index],}]}/>
        <Text>{option}</Text>
      </Pressable>
    );
  });

  return (
    <TouchableOpacity
      onPress={() => props.changeModalVisibility(false)}
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
  icon: {
    width: 25,
    height: 25,
    marginHorizontal: 5,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  modal: {
    width: WIDTH * 0.4,
    maxWidth: 180,
    backgroundColor: "#f7f7f8",
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc80",
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