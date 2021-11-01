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
const HEIGHT = Dimensions.get('window').height;

export default function ParentIssuePicker(props) {
  const OPTIONS = props.issueList;

  const onPressOption = (option) => {
    props.changeSubVisibility(false);
    props.setSub(option);
  }

  const options = OPTIONS.map((option, index) => {
    return (
      <Pressable
        key={index}
        onPress={() => onPressOption({subject: option.subject, id: option.id})}
        style={styles.item}
      >
        <Text>
          {option.parent
          ? <Text>({option.parent.id}) {'>'} </Text>
          : ''
          }
          ({option.id}) {option.subject} 
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
    // alignItems: "flex-start",
    // justifyContent: "flex-start",
  },
  modal: {
    width: WIDTH * 0.75,
    minHeight: 40,
    maxHeight: 430,
    backgroundColor: "#f7f7f8",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#cccccc80",
    left: 10,
    top: HEIGHT * 0.5 + 6,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
  },
})