import React, { useState } from 'react';
import { 
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

import users from '../config/configurations';

export default function AssignUserPicker(props) {
  const defaultUser = props.defaultUser;
  const [targetUser, setTargetUser] = useState(defaultUser);

  let userList = users.map((user, index) => {
    let fullname = user.firstname.concat(' ', user.lastname).trim();
    return (
      <Picker.Item
        label={fullname}
        value={user.id}
        style={{fontSize: 20}}
        key={index} />
    );
  });
  userList.splice(0, 0, <Picker.Item label='' value={0} style={{fontSize: 20}} key={0} />)

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
})
