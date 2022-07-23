import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable,
  Button
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import CheckBox from '@react-native-community/checkbox';

import AddMembership from './AddMembership';
import RemoveMembership from './RemoveMembership';
import myFont from '../config/myFont';

export default function ProjectInformation(props) {
  const user = props.user;
  const project = props.project;
  const members = props.members;
  let isManagerPrivileged = false;

  // Verify if user is manager of this project
  for (let member of members) {
    // Verify if user is member of this project
    if (member.user.id == user.id) {
      // Verify manager role
      for (let role of member.roles) {
        if (role.id == 3) {
          isManagerPrivileged = true;
          break;
        }
      }
      if (isManagerPrivileged) break;
    }
  }

  members.sort((a, b) => {return (a.user.name > b.user.name) ? 1 : ((b.user.name > a.user.name) ? -1 : 0);})
  const membershipList = members.map((membership, index) => {
    let roles = [];
    for (let role of membership.roles) {
      roles.push(role.name);
    }
    return (
      <View
        key={index}
        style={{
          width: "100%",
          flexDirection: "row",
        }}>
        <View
          style={[
            styles.label,
            {width: "40%"}
          ]}>
          <Text style={{fontSize: 20.8}}>{membership.user.name.trim()}</Text>
        </View>
        <View
          style={[
            styles.label,
            {width: "60%", paddingHorizontal: 7}
          ]}>
          <Text style={{fontSize: 20.8}}>{roles.join(', ')}</Text>
        </View>
      </View>
    );
  })

  const [membershipCollapsed, setMembershipCollapsed] = useState(true)
  const [removeMemberCollapsed, setRemoveMemberCollapsed] = useState(true)

  const selectUser = (user) => {
    props.selectUser(user);
  }

  const selectRoles = (roleIds) => {
    props.selectRoles(roleIds);
  }
  
  const saveTargetUser = () => {
    props.saveTargetUser();
  }
  const saveUserToRemove = () => {
    props.saveUserToRemove();
  }
  
  return (
    <Collapsible 
      collapsed={props.collapseDetail}
    >
      <View style={styles.groupRow}>
        <Pressable
          style={({pressed}) => 
          [{
            backgroundColor: pressed
              ? myFont.buttonPressedColor
              : myFont.white
          }]
        }
        >
          <View style={styles.groupCell}>
            <View style={styles.label}>
              <Text style={styles.text}>IDENTIFIER</Text>
            </View>
            <View style={styles.textDate}>
              <Text style={{fontSize: 20.8}}>{project.identifier}</Text>
            </View>
          </View>
        </Pressable>
      </View>
      <View style={[styles.groupRow, {minHeight: 138}]}>
        <Pressable
          style={({pressed}) => [
            {
              backgroundColor: pressed
                ? myFont.buttonPressedColor
                : myFont.white
            }
          ]}
        >
          <View style={[styles.groupCell, {minHeight: 137}]}>
            <View style={styles.label}>
              <Text style={styles.text}>DESCRIPTION</Text>
            </View>
            <View style={styles.textDate}>
              <Text style={{fontSize: 20.8}}>{project.description}</Text>
            </View>
          </View>
        </Pressable>
      </View>
      <View style={styles.groupRow}>
        <Pressable
          style={({pressed}) => 
          [{
            backgroundColor: pressed
              ? myFont.buttonPressedColor
              : myFont.white
          }]}
        >
          <View style={styles.groupCell}>
            <View style={styles.label}>
              <Text style={styles.text}>SUBPROJECT OF</Text>
            </View>
            {
              project.parent ?
              <View style={styles.textDate}>
                <Text style={{fontSize: 20.8}}>
                  #{project.parent.id} - {project.parent.name}
                </Text>
              </View>
              : <></>
            }
          </View>
        </Pressable>
      </View>
      <View
        style={{
          width: "100%",
          borderStyle: "solid",
          borderBottomWidth: 1,
          borderBottomColor: myFont.itemBorderColor,
        }}>
        <Pressable
          style={({pressed}) => 
            [{
              backgroundColor: pressed
                ? myFont.buttonPressedColor
                : myFont.white,
            }]}>
          <View style={styles.groupCell}>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
              }}>
              <View
                style={[
                  styles.label,
                  {width: "40%"}
                ]}>
                <Text style={styles.text}>MEMBERS</Text>
              </View>
              <View
                style={[
                  styles.label,
                  {width: "60%", paddingHorizontal: 7}
                ]}>
                <Text style={styles.text}>ROLES</Text>
              </View>
            </View>
            {membershipList}
          </View>
        </Pressable>
        <AddMembership
          collapsed={membershipCollapsed}
          selectUser={selectUser}
          selectRoles={selectRoles}
          saveTargetUser={saveTargetUser}
          existUser={members} />
        <RemoveMembership
          collapsed={removeMemberCollapsed}
          selectUser={selectUser}
          saveUserToRemove={saveUserToRemove}
          existUser={members} />
        <View style={{flexDirection: "row"}} >
          <View
            style={{
              margin: 10,
            }}>
            <Button
              title={membershipCollapsed ? "NEW MEMBER" : "CLOSE"}
              onPress={() => {
                setMembershipCollapsed(!membershipCollapsed);
                setRemoveMemberCollapsed(true);
              }}/>
          </View>
          {isManagerPrivileged ?
            <View
              style={{
                margin: 10,
              }}>
              <Button
                title={removeMemberCollapsed ? "REMOVE MEMBER" : "CLOSE"}
                onPress={() => {
                  setRemoveMemberCollapsed(!removeMemberCollapsed);
                  setMembershipCollapsed(true);
                }}
                color="red"/>
            </View> : <></>
          }
        </View>
      </View>
      <View
        style={[
          styles.groupRow,
          {flexDirection: "row"}
        ]}
      >
        <Pressable
          style={({pressed}) => [
            styles.halfCell,
            {
              backgroundColor: pressed
                ? myFont.buttonPressedColor
                : myFont.white
            }
          ]}
        >
          <View style={styles.label}>
            <Text style={styles.text}>IS PUBLIC</Text>
          </View>
          <CheckBox
            disabled={true}
            value={project.is_public}
            style={{marginLeft: 4}}
          />
        </Pressable>
        <Pressable
          style={({pressed}) => [
            styles.halfCell,
            {
              backgroundColor: pressed
                ? myFont.buttonPressedColor
                : myFont.white
            }
          ]}
        >
          <View style={styles.label}>
            <Text style={styles.text}>INHERIT MEMBERS</Text>
          </View>
          <CheckBox
            disabled={true}
            value={project.inherit_members}
            style={{marginLeft: 4}}
          />
        </Pressable>
      </View>
    </Collapsible>    
  );
}

const styles = StyleSheet.create({
  addMemberButton: {
    width: "100%",
    height: 35,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  groupRow: {
    width: "100%",
    height: 74,
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: myFont.itemBorderColor,
  },
  groupCell: {
    width: "100%",
    paddingBottom: 10,
  },
  halfCell: {
    width: "50%",
    height: 73,
    borderStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: myFont.itemBorderColor,
  },
  roleCell: {
    width: "33%",
    height: 73,
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: myFont.itemBorderColor,
  },
  memberCell: {
    width: "66%",
    height: 73,
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: myFont.itemBorderColor,
  },
  label: {
    paddingTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 2,
  },
  text: {
    fontSize: myFont.fontAddScreenSize,
    color: myFont.fontAddScreenColor,
    fontWeight: "300",
  },
  textDate: {
    paddingVertical: 1,
    paddingLeft: 10,
    paddingRight: 2,
  },
  statusTouch: {
    width: 25,
    height: 25,
    marginTop: 4,
    marginHorizontal: 10,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
})