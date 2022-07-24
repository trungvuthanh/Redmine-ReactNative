import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Pressable, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const OPTIONS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

export default function DoneRatioPicker(props) {
  const [targetRatio, setTargetRatio] = useState(0);
  
  const options = OPTIONS.map((option, index) => {
    return (
      <Picker.Item
        label={option.toString()}
        value={index + 1}
        style={{fontSize: 20}}
        key={index} />
    );
  });

  return (
    <Picker
      selectedValue={targetRatio}
      onValueChange={(itemValue, itemIndex) => {
        setTargetRatio(itemValue);
        props.setDoneRatio(itemValue);
      }}
      style={styles.dropdownList}>
      {options}
    </Picker>
  );
}

const styles = StyleSheet.create({
  dropdownList: {
    marginLeft: 2
  },
});
