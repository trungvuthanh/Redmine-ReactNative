import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
  Modal,
  Alert,
  Button,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CheckBox from '@react-native-community/checkbox';

import { update_project } from '../api/project_api';
import myFont from '../config/myFont';

export default function EditProjectScreen({ route, navigation }) {
  let project = route.params.project;
    
  // General
  const [name, onChangeName] = useState(project.name);
  const [description, onChangeDescription] = useState(project.description);

  // Project
  const [identifier, onChangeIdentifier] = useState(project.identifier);
  const [isPublic, setIsPublic] = useState(project.is_public);
  const [isInherit, setIsInherit] = useState(project.inherit_members);
  const toIdentifier = (name) => {
    let arrStr = name.trim().split(' ');
    let identifier = [];
    for (name of arrStr) identifier.push(name.toLowerCase());
    identifier = identifier.join('-');
    return identifier;
  }

  const saveData = () => {
    name != ""
    ? updateData()
    : Alert.alert(
      "Name cannot be blank",
      "",
      [{
        text: "OK",
        style: "cancel"
      }]
    );
  }

  const updateData = async () => {
    let body = JSON.stringify({
      project: {
        name: name,
        identifier: identifier,
        description: description,
        is_public: isPublic,
        inherit_members: isInherit,
      }
    });
    update_project(project.id, body)
    .then((response) => {
      console.log(response.status);
      if (response.status == 204) {
        Alert.alert(
          "Project updated successfully",
          "",
          [{
            text: 'OK',
            style: 'cancel',
            onPress: () => navigation.goBack(),
          }]
        );  
      } else {
        Alert.alert(
          "Fail to edit project",
          "",
        );
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={styles.header.height}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.pop()}
          style={styles.closeBtn}>
          <View>
            <Ionicons name="close-sharp" size={myFont.menuIconSize} color="white" />
          </View>
        </Pressable>
        <Text style={styles.textHeader}>Edit project</Text>
      </View>
      <ScrollView style={{marginBottom: 50}}>
        <View style={styles.groupRow}>
          <Pressable
            style={({pressed}) => 
            [{
              backgroundColor: pressed
                ? myFont.buttonPressedColor
                : myFont.white
            }]}>
            <View style={styles.groupCell}>
              <View style={styles.label}>
                <Text style={styles.text}>NAME *</Text>
              </View>
              <TextInput
                style={styles.textInput}
                textAlignVertical="center"
                value={name}
                onChangeText={(name) => {
                  onChangeName(name);
                  onChangeIdentifier(toIdentifier(name));
                }}
              />
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
              }]}>
            <View style={styles.groupCell}>
              <View style={styles.label}>
                <Text style={styles.text}>IDENTIFIER *</Text>
              </View>
              <Text style={styles.textInput}>{identifier}</Text>
            </View>
          </Pressable>
        </View>
        <View style={[styles.groupRow, {height: 138}]}>
          <Pressable
            style={({pressed}) => [
              {
                backgroundColor: pressed
                  ? myFont.buttonPressedColor
                  : myFont.white
              }]}>
            <View style={[styles.groupCell, {height: 137}]}>
              <View style={styles.label}>
                <Text style={styles.text}>DESCRIPTION</Text>
              </View>
              <TextInput 
                style={[
                  styles.textInput,
                  {minHeight: 100},
                ]} 
                multiline={true} 
                textAlignVertical="top"
                value={description}
                onChangeText={(text) => onChangeDescription(text)}
              />
            </View>
          </Pressable>
        </View>
        {project.parent ?
          <View style={styles.groupRow}>
            <Pressable
              style={({pressed}) => 
                [{
                  backgroundColor: pressed
                    ? myFont.buttonPressedColor
                    : myFont.white
                }]}>
              <View style={styles.groupCell}>
                <View style={styles.label}>
                  <Text style={styles.text}>SUBPROJECT OF *</Text>
                </View>
                <Text style={styles.textInput}>{project.parent.name}</Text>
              </View>
            </Pressable>
          </View>
          : <></>
        }
        <View 
          style={[
            styles.groupRow,
            {flexDirection: "row"}
          ]}>
          <Pressable
            style={({pressed}) => [
              styles.halfCell,
              {
                backgroundColor: pressed
                  ? myFont.buttonPressedColor
                  : myFont.white
              }]}>
            <View style={styles.label}>
              <Text style={styles.text}>IS PUBLIC</Text>
            </View>
            <CheckBox
              disabled={false}
              value={isPublic}
              onValueChange={(newValue) => setIsPublic(newValue)}
              style={{marginLeft: 4}}
            />
          </Pressable>
          <Pressable
            style={({pressed}) => [
              styles.halfCell,
              {
                backgroundColor: pressed
                  ? myFont.buttonPressedColor
                  : myFont.white,
                position: "relative",
              }]}>
            <View style={styles.label}>
              <Text style={styles.text}>INHERIT MEMBERS</Text>
            </View>
            <CheckBox
              disabled={false}
              value={isInherit}
              onValueChange={(newValue) => setIsInherit(newValue)}
              style={{marginLeft: 4}}
            />
          </Pressable>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button
          title="SAVE"
          onPress={() => saveData()}
          color={myFont.green}/>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
		width: "100%",
		height: 60,
		backgroundColor: "#4d5360",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
	},
  closeBtn: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  textHeader: {
    color: myFont.white,
    fontSize: myFont.fontHomeHeaderSize,
		fontWeight: "300",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    letterSpacing: myFont.letterSpace,
  },
  saveButton: {
    height: 50,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    borderTopColor: myFont.footerBorderColor,
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    padding: 10,
  },
  halfCell: {
    width: "50%",
    height: 73,
    borderStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: myFont.itemBorderColor,
    paddingRight: 5,
  },
  dateIcon: {
    position: "absolute",
    top: 2,
    right: 10,
  },
  groupCell: {
    width: "100%",
  },
  groupRow: {
    width: "100%",
    height: 74,
    marginBottom: 10,
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: myFont.itemBorderColor,
  },
  text: {
    fontSize: myFont.fontAddScreenSize,
    color: myFont.fontAddScreenColor,
    fontWeight: "300",
  },
  label: {
    paddingTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 2,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textInput: {
    width: "100%",
    height: 40,
    fontSize: 20.8,
    fontWeight: "300",
    paddingVertical: 1,
    paddingLeft: 10,
    paddingRight: 2,
  },
  textDate: {
    position: "relative",
    paddingVertical: 1,
    paddingLeft: 10,
    paddingRight: 2,
  },
  statusTouch: {
    width: 25,
    height: 25,
    marginTop: 4,
    marginLeft: 10,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
})