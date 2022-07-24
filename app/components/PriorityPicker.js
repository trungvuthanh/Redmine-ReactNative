import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const OPTIONS = ['Low', 'Normal', 'High', 'Urgent', 'Immediate'];

export default function PriorityPicker(props) {
  const [targetPriority, setTargetPriority] = useState(1);

  const options = OPTIONS.map((option, index) => {
    return (
      <Picker.Item
        label={option}
        value={index + 1}
        style={{fontSize: 20}}
        key={index} />
    );
  });

  return (
    <Picker
      selectedValue={targetPriority}
      onValueChange={(itemValue, itemIndex) => {
        setTargetPriority(itemValue);
        props.setPriority(itemValue);
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
