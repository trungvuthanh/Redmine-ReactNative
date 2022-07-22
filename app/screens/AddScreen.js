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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import CheckBox from '@react-native-community/checkbox';
import DocumentPicker from 'react-native-document-picker';

import { create_issue } from '../api/issue_api';
import myFont from '../config/myFont';

import TrackerPicker from '../components/TrackerPicker';
import PriorityPicker from '../components/PriorityPicker';
import StatusPicker from '../components/StatusPicker';
import ParentProjectPicker from '../components/ParentProjectPicker';
import ParentIssuePicker from '../components/ParentIssuePicker';
import DoneRatioPicker from '../components/DoneRatioPicker';
import AssignUserPicker from '../components/AssignUserPicker';
import { localhost } from '../config/configurations';

function dateInput() {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const showDatepicker = () => {
    setShow(true);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date
    setShow(false);
    setDate(currentDate);
  }
  return {
    date,
    show,
    showDatepicker,
    onChange
  }
}

export default function AddScreen({ route, navigation }) {
  const type = route.params.type;
  let projects = [], issues = [];
  let parent_id; // parent project
  if (type === 'project') {
    projects = route.params.projects
    if (route.params.parent != undefined) {
      parent_id = route.params.parent;
    }
  } else if (type === 'issue') {
    issues = route.params.issues; // issues of parent project
    parent_id = route.params.parent_id; // id of parent project
    if (route.params.parent_issue != undefined) {
      if (issues[0] != route.params.parent_issue) {
        issues.splice(0, 0, route.params.parent_issue); // insert parent issue to issue_list for creating new issue
      }
    }
  }

  // General
  const [name, onChangeName] = useState("");
  const [description, onChangeDescription] = useState("");
  const [subproject, onChangeSubProject] = useState(
    type === 'project'
    ? {
        name: "",
        id: 0
      }
    : route.params.parent_issue // type === 'issue'
    ? {
        subject: route.params.parent_issue.subject,
        id: route.params.parent_issue.id
      }
    : {
        subject: "",
        id: 0
      }
  );
  const setSubProject = (option) => {
    onChangeSubProject(option);
  }

  // Project
  const [identifier, onChangeIdentifier] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isInherit, setIsInherit] = useState(false);
  const toIdentifier = (name) => {
    let arrStr = name.trim().split(' ');
    let identifier = [];
    for (name of arrStr) identifier.push(name.toLowerCase());
    identifier = identifier.join('-');
    return identifier;
  }

  // Issue
  const startDate = dateInput();
  const endDate = dateInput();
  const [duration, onChangeDuration] = useState(null);
  const [status, onChangeStatus] = useState(1);
  const [isStatusVisible, setIsStatusVisible] = useState(false);
  const [tracker, onChangeTracker] = useState({name: 'Bug', id: 1});
  const [isTrackerVisible, setIsTrackerVisible] = useState(false);
  const [priority, onChangePriority] = useState({name: 'Normal', id: 2});
  const [isPriorityVisible, setIsPriorityVisible] = useState(false);
  const [doneRatio, onChangeDoneRatio] = useState(0);
  const [isDoneRatioVisible, setIsDoneRatioVisible] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [assignee, setAssignee] = useState();

  const setAssignUser = (user_id) => {
    setAssignee(user_id);
  }
    
  const onChangeStart = (event, selectedDate) => {
    startDate.onChange(event, selectedDate);
  }
  const onChangeEnd = (event, selectedDate) => {
    endDate.onChange(event, selectedDate);
  }
  const changeStatusVisibility = (bool) => {
    setIsStatusVisible(bool);
  }
  const changeTrackerVisibility = (bool) => {
    setIsTrackerVisible(bool);
  }
  const changePriorityVisibility = (bool) => {
    setIsPriorityVisible(bool);
  }
  const changeDoneRatioVisibility = (bool) => {
    setIsDoneRatioVisible(bool);
  }

  const standardDate = (rawDate) => {
    let date = rawDate.toLocaleDateString().split('/');
    let year = '20' + date.pop();
    date.splice(0, 0, year);
    return date.join('-');
  }

  const uploadFile = async () => {
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.images],
      })
      .then(() => {
        if (results != null) {
          for (const res of results) {
            console.log(
              res.uri,
              res.type, // mime type
              res.name,
              res.size,
            )
          }  
        } else {
          console.log('Error')
        }
      })
      .catch((error) => {
        console.error(error);
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err
      }
    }
  }

  const saveData = () => {
    if (type === 'project') {
      name != ""
      ?  createData()
      :  Alert.alert(
          "Name cannot be blank",
          "",
          [{
            text: "OK",
            style: "cancel"
          }]
        );
    } else if (type === 'issue') {
      name != ""
      ? createData()
      :  Alert.alert(
        "Name cannot be blank",
        "",
        [{
          text: "OK",
          style: "cancel",
        }]
      );
    }
    
  }

  const createData = async () => {
    let u = await AsyncStorage.getItem('user');
    let user;
    if (u) {
      user = JSON.parse(u);
      if (type === 'project') {
        let body;
        if (parent_id == undefined) {
          subproject.name == ""
          ? body = JSON.stringify({
            project: {
              name: name,
              identifier: identifier,
              description: description,
              is_public: isPublic,
              inherit_members: isInherit,
            }
          })
          : body = JSON.stringify({
            project: {
              name: name,
              identifier: identifier,
              description: description,
              is_public: isPublic,
              parent_id: subproject.id,
              inherit_members: isInherit,
            }
          });  
        } else {
          body = JSON.stringify({
            project: {
              name: name,
              identifier: identifier,
              description: description,
              is_public: isPublic,
              parent_id: parent_id.id,
              inherit_members: isInherit,
            }
          });  
        }
        fetch(localhost + 'projects.json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Redmine-API-Key': user.api_key,
          },
          body: body,
        })
        .then((response) => {
          console.log(response.status);
          if (response.status == 201) {
            Alert.alert(
              "Project was created",
              "",
              [{
                text: 'OK',
                style: 'cancel',
                onPress: () => navigation.goBack(),
              }]
            );  
          } else {
            Alert.alert(
              "Fail to create project",
              "",
            );
          }
        })
        .catch((error) => {
          console.error(error);
        });
      } else if (type === 'issue') {
        let estimated_hours;
        duration == null ? estimated_hours = null : estimated_hours = parseInt(duration);
        let body;
        subproject.subject == ""
        ? body = JSON.stringify({
          issue: {
            project_id: parent_id,
            tracker_id: tracker.id,
            status_id: status,
            priority_id: priority.id,
            subject: name,
            description: description,
            assigned_to_id: assignee,
            is_private: isPrivate,
            estimated_hours: estimated_hours,
            start_date: standardDate(startDate.date),
            due_date: standardDate(endDate.date),
            done_ratio: doneRatio,
          }
        })
        : body = JSON.stringify({
          issue: {
            project_id: parent_id,
            tracker_id: tracker.id,
            status_id: status,
            priority_id: priority.id,
            subject: name,
            description: description,
            parent_issue_id: subproject.id,
            assigned_to_id: assignee,
            is_private: isPrivate,
            estimated_hours: estimated_hours,
            start_date: standardDate(startDate.date),
            due_date: standardDate(endDate.date),
            done_ratio: doneRatio,
          }
        });
        create_issue(body)
        .then((response) => {
          if (response.status == 201) {
            Alert.alert(
              "Issue was added",
              "",
              [{
                text: 'OK',
                style: 'cancel',
                onPress: () => navigation.goBack(),
              }]
            );  
          } else {
            Alert.alert(
              "Fail to create issue",
              "",
            );
          }
        })
        .catch((error) => {
          console.error(error);
        });
      }
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={styles.header.height}
    >
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.pop()}
          style={styles.closeBtn}
        >
          <View>
            <Ionicons name="close-sharp" size={myFont.menuIconSize} color="white" />
          </View>
        </Pressable>
          {type === 'project' 
          ? <Text style={styles.textHeader}>Add project</Text> 
          : <Text style={styles.textHeader}>Add issue</Text>}
      </View>

      <ScrollView style={{marginBottom: 50}}>
        {type === 'project'
        ? <>
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
                  }]
                }
              >
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
                  }
                ]}
              >
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
                  <View style={[styles.label, {justifyContent: "space-between"}]}>
                    <Text style={styles.text}>SUBPROJECT OF</Text>
                  </View>
                  {parent_id != undefined ?
                    <Text style={styles.textInput}>{parent_id != undefined ? parent_id.name : subproject.name}</Text>
                    : <ParentProjectPicker
                        setSub={setSubProject}
                        projectList={projects}
                      />}
                </View>
              </Pressable>
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
                  }
                ]}
              >
                <View style={styles.label}>
                  <Text style={styles.text}>INHERIT MEMBERS</Text>
                </View>
                <CheckBox
                  value={isInherit}
                  onValueChange={(newValue) => setIsInherit(newValue)}
                  style={{marginLeft: 4}}
                />
              </Pressable>
            </View>
          </>
        : <>
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
                    <Text style={styles.text}>SUBJECT *</Text>
                  </View>
                  <TextInput
                    style={styles.textInput}
                    textAlignVertical="center"
                    value={name}
                    onChangeText={(name) => {
                      onChangeName(name);
                    }}
                  />
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
                  }
                ]}
              >
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
                    <Text style={styles.text}>PARENT TASK</Text>
                  </View>
                  <ParentIssuePicker
                    setSub={setSubProject}
                    issueList={issues}
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
                }]
              }
              >
                <View style={styles.groupCell}>
                  <View style={styles.label}>
                    <Text style={styles.text}>ASSIGNEE</Text>
                  </View>
                  <AssignUserPicker
                    setAssignUser={setAssignUser}
                    defaultUser={0}
                  />
                </View>
              </Pressable>
            </View>
            <View 
              style={[
                styles.groupRow,
                {flexDirection: "row"}
              ]}
            >
              <Pressable
                onPress={startDate.showDatepicker}
                style={styles.halfCell}
              >
                <View style={styles.label}>
                  <Text style={styles.text}>START DATE</Text>
                </View>
                <View style={styles.textDate}>
                  <Text style={{fontSize: 20.8}}>{standardDate(startDate.date).split('-').reverse().join('/')}</Text>
                  <View style={styles.dateIcon}>
                    <Ionicons name="calendar-sharp" size={24} color={myFont.blue} />
                  </View>
                </View>
                {startDate.show && (
                  <DateTimePicker
                    testID="dateStartPicker"
                    value={startDate.date}
                    mode="date"
                    is24Hour={true}
                    onChange={onChangeStart}
                    
                  />
                )}
              </Pressable>
              <Pressable
                onPress={endDate.showDatepicker}
                style={styles.halfCell}
              >
                <View style={styles.label}>
                  <Text style={styles.text}>DUE DATE</Text>
                </View>
                <View style={styles.textDate}>
                  <Text style={{fontSize: 20.8}}>{standardDate(endDate.date).split('-').reverse().join('/')}</Text>
                  <View style={styles.dateIcon}>
                    <Ionicons name="calendar-sharp" size={24} color={myFont.blue} />
                  </View>
                </View>
                {endDate.show && (
                  <DateTimePicker
                    testID="dateEndPicker"
                    value={endDate.date}
                    mode="date"
                    is24Hour={true}
                    onChange={onChangeEnd}
                  />
                )}
              </Pressable>
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
                  },
                ]}
              >
                <View style={styles.label}>
                  <Text style={styles.text}>ESTIMATED TIME (H)</Text>
                </View>
                <TextInput
                  style={styles.textInput}
                  textAlignVertical="center"
                  value={duration}
                  onChangeText={(value) => onChangeDuration(value.toString())}
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
                  }
                ]}
              >
                <View style={styles.label}>
                  <Text style={styles.text}>STATUS *</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Pressable
                    onPress={() => changeStatusVisibility(true)}
                    style={[styles.statusTouch, {backgroundColor: myFont.statusColor[status - 1]}]}
                  />
                  <Text style={styles.textInput}>New</Text>
                </View>
                
                <View>
                  <Modal
                    transparent={true}
                    visible={isStatusVisible}
                    onRequestClose={() => changeStatusVisibility(false)}
                  >
                    <StatusPicker
                      changeStatusVisibility={changeStatusVisibility}
                      setStatus={onChangeStatus}
                      editMode={false}
                    />
                  </Modal>
                </View>
              </Pressable>
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
                      : myFont.white,
                    position: "relative",
                  }
                ]}
              >
                <View style={styles.label}>
                  <Text style={styles.text}>TRACKER *</Text>
                </View>
                <Pressable
                  onPress={() => changeTrackerVisibility(true)}
                >
                  <Text style={styles.textInput}>{tracker.name}</Text>
                </Pressable>
                <View>
                  <Modal
                    transparent={true}
                    visible={isTrackerVisible}
                    onRequestClose={() => changeTrackerVisibility(false)}
                  >
                    <TrackerPicker
                      changeTrackerVisibility={changeTrackerVisibility}
                      setTracker={onChangeTracker}
                    />
                  </Modal>
                </View>
              </Pressable>
              <Pressable
                style={({pressed}) => [
                  styles.halfCell,
                  {
                    backgroundColor: pressed
                      ? myFont.buttonPressedColor
                      : myFont.white,
                    position: "relative",
                  }
                ]}
              >
                <View style={styles.label}>
                  <Text style={styles.text}>PRIORITY *</Text>
                </View>
                <Pressable
                  onPress={() => changePriorityVisibility(true)}
                >
                  <Text style={styles.textInput}>{priority.name}</Text>
                </Pressable>
                <View>
                  <Modal
                    transparent={true}
                    visible={isPriorityVisible}
                    onRequestClose={() => changePriorityVisibility(false)}
                  >
                    <PriorityPicker
                      changePriorityVisibility={changePriorityVisibility}
                      setPriority={onChangePriority}
                    />
                  </Modal>
                </View>
              </Pressable>
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
                      : myFont.white,
                    position: "relative",
                  }
                ]}
              >
                <View style={styles.label}>
                  <Text style={styles.text}>% DONE</Text>
                </View>
                <Pressable
                  onPress={() => changeDoneRatioVisibility(true)}
                >
                  <Text style={styles.textInput}>{doneRatio.toString()} %</Text>
                </Pressable>
                <View>
                  <Modal
                    transparent={true}
                    visible={isDoneRatioVisible}
                    onRequestClose={() => changeDoneRatioVisibility(false)}
                  >
                    <DoneRatioPicker
                      changeDoneRatioVisibility={changeDoneRatioVisibility}
                      setDoneRatio={onChangeDoneRatio}
                    />
                  </Modal>
                </View>
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
                  <Text style={styles.text}>PRIVATE</Text>
                </View>
                <CheckBox
                  disabled={false}
                  value={isPrivate}
                  onValueChange={(newValue) => setIsPrivate(newValue)}
                  style={{marginLeft: 4}}
                />
              </Pressable>
            </View>
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
                    <Text style={styles.text}>Attach files</Text>
                  </View>
                </View>
              </Pressable>
              <View style={{width: "50%", alignSelf: "center"}}>
                <Button
                  title="Upload files"
                  onPress={() => uploadFile()}
                ></Button>
              </View>
            </View>
          </>
        }
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
    minHeight: 74,
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