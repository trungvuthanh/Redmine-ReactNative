import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

let OPTIONS = ['New'];
let status = 1;

export default function StatusPicker(props) {
  if (props.editMode == true) {
    OPTIONS = ['New', 'In Progress', 'Resolved', 'Feedback', 'Closed', 'Rejected'];
    status = props.status;
  }
  
  const [targetStatus, setTargetStatus] = useState(status);

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
      selectedValue={targetStatus}
      onValueChange={(itemValue, itemIndex) => {
        setTargetStatus(itemValue);
        props.setStatus(itemValue);
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
