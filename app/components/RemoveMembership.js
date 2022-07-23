import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable,
  Button
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import { Picker } from '@react-native-picker/picker';

import myFont from '../config/myFont';

export default function AddMembership(props) {
  const existUser = props.existUser;
  const [targetUser, setTargetUser] = useState(0);

  let userList = existUser.map((user, index) => {
    return (
      <Picker.Item
        label={user.user.name.trim()}
        value={user.user.id}
        style={{fontSize: 20}}
        key={index} />
    )
  });
  userList.splice(0, 0, <Picker.Item label={'Select a user'} value={0} style={{fontSize: 20}} key={0} />)

  const saveUserToRemove = () => {
    props.saveUserToRemove();
  }

  return (
    <Collapsible 
      collapsed={props.collapsed}
      style={{backgroundColor: myFont.white}}
    >
      <View style={{
        width: "80%",
        alignSelf: "center",
        borderStyle: "solid",
        borderBottomWidth: 2,
        borderBottomColor: myFont.itemBorderColor,
        marginBottom: 5,
      }} />
      <View style={{width: "100%", flexDirection: "row"}} >
        <View style={[styles.label, {width: "40%"}]}>
          <Text style={styles.textLabel}>SELECT USER</Text>
        </View>
        <Picker
          selectedValue={targetUser}
          onValueChange={
            (itemValue, itemIndex) => {
              setTargetUser(itemValue);
              props.selectUser(itemValue);
            }
          }
          style={styles.userDropdownList}>
          {userList}
        </Picker>
      </View>
      <View style={{width: "100%", flexDirection: "row", justifyContent: "flex-end"}} >
        <View
          style={[
            styles.roleRow,
            {paddingHorizontal: 10}]}>
          <Button
            title="Remove"
            onPress={() => saveUserToRemove()}
            color="red"
          />
        </View>
      </View>
    </Collapsible>    
  );
}

const styles = StyleSheet.create({
  addPhaseContainer: {
    width: "100%",
    paddingHorizontal: 2,
    paddingVertical: 15,
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: myFont.itemBorderColor
  },
  addPhaseButton: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: myFont.blue,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 60,
  },
  addPhaseText: {
    color: myFont.blue,
    fontSize: 20,
    fontWeight: "700"
  },
  statusContainer: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  status: {
    width: 25,
    height: 25,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  userDropdownList: {
    width: "60%",
    height: 30,
    marginVertical: 5,
  },
  roleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  roleText: {
    fontSize: 20
  },
  label: {
    paddingTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 2,
  },
  textLabel: {
    fontSize: myFont.fontAddScreenSize,
    color: myFont.fontAddScreenColor,
    fontWeight: "300",
  },
});
