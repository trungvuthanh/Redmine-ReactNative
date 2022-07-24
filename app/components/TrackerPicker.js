import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const OPTIONS = ['Bug', 'Feature', 'Support'];

export default function TrackerPicker(props) {
  const [targetTracker, setTargetTracker] = useState(1);

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
      selectedValue={targetTracker}
      onValueChange={(itemValue, itemIndex) => {
        setTargetTracker(itemValue);
        props.setTracker(itemValue);
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
