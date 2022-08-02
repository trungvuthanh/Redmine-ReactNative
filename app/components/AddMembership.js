import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import { Picker } from '@react-native-picker/picker';
import CheckBox from '@react-native-community/checkbox';

import myFont from '../config/myFont';
import users from '../config/configurations';

let roleIds = [];

export default function AddMembership(props) {
  const existUser = props.existUser;
  const [targetUser, setTargetUser] = useState(0);
  const [isManager, setIsManager] = useState(false);
  const [isDeveloper, setIsDeveloper] = useState(false);
  const [isReporter, setIsReporter] = useState(false);

  let arrOfExistUser = [];
  for (let u of existUser) {
    arrOfExistUser.push(u.user.name.trim());
  }

  let userList = []
  userList.splice(0, 0, <Picker.Item label={'Select a user'} value={0} style={{ fontSize: 20 }} key={0} />)
  let index = 1;
  for (let user of users) {
    let fullname = user.firstname.concat(' ', user.lastname).trim();
    if (!arrOfExistUser.includes(fullname)) {
      userList.push(<Picker.Item label={fullname} value={user.id} style={{ fontSize: 20 }} key={index} />);
      index++;
    }
  }

  const updateSelectedRoles = (role) => {
    if (roleIds.includes(role)) {
      roleIds = roleIds.filter(item => item != role);
    } else roleIds.push(role);
    props.selectRoles(roleIds);
  }

  const saveTargetUser = () => {
    props.saveTargetUser();
  }

  return (
    <Collapsible
      collapsed={props.collapsed}
      style={{ backgroundColor: myFont.white }}>
      <View style={{
        width: "80%",
        alignSelf: "center",
        borderStyle: "solid",
        borderBottomWidth: 2,
        borderBottomColor: myFont.itemBorderColor,
        marginBottom: 5,
      }} />
      <View
        style={{
          width: "100%",
          flexDirection: "row"
        }}>
        <View style={[styles.label, { width: "40%" }]}>
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
      <View style={{ width: "100%", flexDirection: "row" }} >
        <View style={[styles.label, { width: "40%" }]}>
          <Text style={styles.textLabel}>SELECT ROLE</Text>
        </View>
        <View
          style={{ width: "60%" }}>
          <View
            style={styles.roleRow}>
            <CheckBox
              disabled={false}
              value={isManager}
              onValueChange={(newValue) => {
                setIsManager(newValue);
                updateSelectedRoles(3);
              }}
              style={{ marginRight: 10 }}
            />
            <Text style={styles.roleText}>Manager</Text>
          </View>
          <View
            style={styles.roleRow}>
            <CheckBox
              disabled={false}
              value={isDeveloper}
              onValueChange={(newValue) => {
                setIsDeveloper(newValue);
                updateSelectedRoles(4);
              }}
              style={{ marginRight: 10 }}
            />
            <Text style={styles.roleText}>Developer</Text>
          </View>
          <View
            style={styles.roleRow}>
            <CheckBox
              disabled={false}
              value={isReporter}
              onValueChange={(newValue) => {
                setIsReporter(newValue);
                updateSelectedRoles(5);
              }}
              style={{ marginRight: 10 }}
            />
            <Text style={styles.roleText}>Reporter</Text>
          </View>
          <View
            style={[
              styles.roleRow,
              { justifyContent: "flex-end", paddingHorizontal: 10 }]}>
            <Button
              title="Save"
              onPress={() => saveTargetUser()}
              color={myFont.green}
            />
          </View>
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
