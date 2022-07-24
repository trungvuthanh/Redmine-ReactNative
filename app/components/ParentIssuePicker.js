import React, { useState } from 'react';
import { 
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function ParentIssuePicker(props) {
  const [targetIssue, setTargetIssue] = useState(0);

  let issueList = props.issueList.map((issue, index) => {
    return (
      <Picker.Item
        label={'#' + issue.id + ' - ' + issue.subject}
        value={issue.id}
        style={{fontSize: 20}}
        key={index} />
    );
  });
  issueList.splice(0, 0, <Picker.Item label='Select an issue' value={0} style={{fontSize: 20}} key={0} enabled={false} />)

  return (
    <Picker
      selectedValue={targetIssue}
      onValueChange={(itemValue, itemIndex) => {
        setTargetIssue(itemValue);
        props.setSub(props.issueList.find(issue => issue.id === itemValue))
      }}
      style={styles.dropdownList}>
      {issueList}
    </Picker>
  );
}

const styles = StyleSheet.create({
  dropdownList: {
    height: 30,
    marginLeft: 2
  },
});
