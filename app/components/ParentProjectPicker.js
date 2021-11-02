import React, { useState } from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Pressable, 
  Dimensions,
} from 'react-native';

const WIDTH = Dimensions.get('window').width;

export default function ParentProjectPicker(props) {
  const OPTIONS = props.projectList;

  const onPressOption = (option) => {
    // console.log(option);
    props.changeSubVisibility(false);
    props.setSub(option);
  }

  const options = OPTIONS.map((option, index) => {
    return (
      <Pressable
        key={index}
        onPress={() => onPressOption(option)}
        style={styles.item}
      >
        <Text>
          {option.parent
          ? <Text>(#{option.parent.id}) {'>'} </Text>
          : ''
          }
          (#{option.id}) {option.name} 
        </Text>
      </Pressable>
    );
  });

  return (
    <TouchableOpacity
      onPress={() => props.changeSubVisibility(false)}
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
    width: WIDTH * 0.75,
    maxHeight: 430,
    backgroundColor: "#f7f7f8",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#cccccc80",
    left: 10,
    bottom: 147,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
  },
})