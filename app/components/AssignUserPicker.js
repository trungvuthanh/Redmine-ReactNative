import React, { useState } from 'react';
import {
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function AssignUserPicker(props) {
  const defaultUser = props.defaultUser;
  const users = props.userList;
  const [targetUser, setTargetUser] = useState(defaultUser);

  let userList;
  if (users.length > 0) {
    userList = users.map((user, index) => {
      let fullname = user.user.name.trim();
      return (
        <Picker.Item
          label={fullname}
          value={user.id}
          style={{ fontSize: 20 }}
          key={index} />
      );
    });
  } else {
    userList = [<Picker.Item label='Assign to me' value={-1} style={{ fontSize: 20 }} key={1} />];
  }
  userList.splice(0, 0, <Picker.Item label='' value={0} style={{ fontSize: 20 }} key={0} />)

  return (
    <Picker
      selectedValue={targetUser}
      onValueChange={(itemValue, itemIndex) => {
        setTargetUser(itemValue);
        props.setAssignUser(itemValue);
      }}
      style={styles.userDropdownList}>
      {userList}
    </Picker>
  );
}

const styles = StyleSheet.create({
  userDropdownList: {
    height: 30,
    marginLeft: 2
  },
});
