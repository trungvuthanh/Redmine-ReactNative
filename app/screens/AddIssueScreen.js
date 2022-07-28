import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Button,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import CheckBox from '@react-native-community/checkbox';
import DocumentPicker from 'react-native-document-picker';

import { get_memberships } from '../api/membership_api';
import { create_issue } from '../api/issue_api';
import { get_user } from '../api/user_api';
import myFont from '../config/myFont';

import TrackerPicker from '../components/TrackerPicker';
import PriorityPicker from '../components/PriorityPicker';
import StatusPicker from '../components/StatusPicker';
import ParentIssuePicker from '../components/ParentIssuePicker';
import DoneRatioPicker from '../components/DoneRatioPicker';
import AssignUserPicker from '../components/AssignUserPicker';

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

export default function AddIssueScreen({ route, navigation }) {
  let project_id = route.params.project_id;
  let parentIssueList = route.params.parent_issue_list;
  let parent_issue = route.params.parent_issue;

  // General
  const [name, onChangeName] = useState("");
  const [description, onChangeDescription] = useState("");
  const [parentIssue, onChangeParentIssue] = useState(
    parent_issue
      ? {
        subject: parent_issue.subject,
        id: parent_issue.id
      }
      : {
        subject: '',
        id: 0
      }
  );
  const setParentIssue = (option) => {
    onChangeParentIssue(option);
  }

  // Issue
  const startDate = dateInput();
  const endDate = dateInput();
  const [duration, onChangeDuration] = useState(null);
  const [status, onChangeStatus] = useState(1);
  const [tracker, onChangeTracker] = useState(1);
  const [priority, onChangePriority] = useState(2);
  const [doneRatio, onChangeDoneRatio] = useState(0);
  const [isPrivate, setIsPrivate] = useState(false);
  const [assignee, setAssignee] = useState();
  // members of this project
  const [members, setMembers] = useState([]);

  const setAssignUser = (user_id) => {
    setAssignee(user_id);
  }

  const onChangeStart = (event, selectedDate) => {
    startDate.onChange(event, selectedDate);
  }
  const onChangeEnd = (event, selectedDate) => {
    endDate.onChange(event, selectedDate);
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
        ? createData()
        : Alert.alert(
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
        : Alert.alert(
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
    let estimated_hours = duration == null ? null : parseInt(duration);
    let author_id;
    if (assignee == -1) {
      let user = await get_user();
      author_id = user.id;
    } else {
      author_id = assignee;
    }
    let body;
    parentIssue.subject == ""
      ? body = JSON.stringify({
        issue: {
          project_id: project_id,
          tracker_id: tracker,
          status_id: status,
          priority_id: priority.id,
          subject: name,
          description: description,
          assigned_to_id: author_id,
          is_private: isPrivate,
          estimated_hours: estimated_hours,
          start_date: standardDate(startDate.date),
          due_date: standardDate(endDate.date),
          done_ratio: doneRatio,
        }
      })
      : body = JSON.stringify({
        issue: {
          project_id: project_id,
          tracker_id: tracker,
          status_id: status,
          priority_id: priority.id,
          subject: name,
          description: description,
          parent_issue_id: parentIssue.id,
          assigned_to_id: author_id,
          is_private: isPrivate,
          estimated_hours: estimated_hours,
          start_date: standardDate(startDate.date),
          due_date: standardDate(endDate.date),
          done_ratio: doneRatio,
        }
      });
    create_issue(body)
      .then((response) => {
        console.log(response.status);
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

  // type === 'project'
  const syncMemberships = async () => {
    /*
    Get memberships of this project
    */
    get_memberships(project_id)
      .then((data) => {
        setMembers(data.memberships);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    syncMemberships();
  }, [])

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
        <Text style={styles.textHeader}>Add issue</Text>
      </View>
      <ScrollView style={{ marginBottom: 50 }}>
        <View style={styles.groupRow}>
          <Pressable
            style={({ pressed }) =>
              [{
                backgroundColor: pressed
                  ? myFont.buttonPressedColor
                  : myFont.white
              }]}>
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
        <View style={[styles.groupRow, { height: 138 }]}>
          <Pressable
            style={({ pressed }) => [
              {
                backgroundColor: pressed
                  ? myFont.buttonPressedColor
                  : myFont.white
              }]}>
            <View style={[styles.groupCell, { height: 137 }]}>
              <View style={styles.label}>
                <Text style={styles.text}>DESCRIPTION</Text>
              </View>
              <TextInput
                style={[
                  styles.textInput,
                  { minHeight: 100 },
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
            style={({ pressed }) =>
              [{
                backgroundColor: pressed
                  ? myFont.buttonPressedColor
                  : myFont.white
              }]}>
            <View style={styles.groupCell}>
              <View style={styles.label}>
                <Text style={styles.text}>PARENT TASK</Text>
              </View>
              <ParentIssuePicker
                setSub={setParentIssue}
                issueList={parentIssueList}
              />
            </View>
          </Pressable>
        </View>
        <View style={styles.groupRow}>
          <Pressable
            style={({ pressed }) =>
              [{
                backgroundColor: pressed
                  ? myFont.buttonPressedColor
                  : myFont.white
              }]}>
            <View style={styles.groupCell}>
              <View style={styles.label}>
                <Text style={styles.text}>ASSIGNEE</Text>
              </View>
              <AssignUserPicker
                setAssignUser={setAssignUser}
                defaultUser={0}
                userList={members}
              />
            </View>
          </Pressable>
        </View>
        <View
          style={[
            styles.groupRow,
            { flexDirection: "row" }
          ]}>
          <Pressable
            onPress={startDate.showDatepicker}
            style={styles.halfCell}>
            <View style={styles.label}>
              <Text style={styles.text}>START DATE</Text>
            </View>
            <View style={styles.textDate}>
              <Text style={{ fontSize: 20.8 }}>{standardDate(startDate.date).split('-').reverse().join('/')}</Text>
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
            style={styles.halfCell}>
            <View style={styles.label}>
              <Text style={styles.text}>DUE DATE</Text>
            </View>
            <View style={styles.textDate}>
              <Text style={{ fontSize: 20.8 }}>{standardDate(endDate.date).split('-').reverse().join('/')}</Text>
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
            { flexDirection: "row" }
          ]}>
          <Pressable
            style={({ pressed }) => [
              styles.halfCell,
              {
                backgroundColor: pressed
                  ? myFont.buttonPressedColor
                  : myFont.white
              }]}>
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
            style={({ pressed }) => [
              styles.halfCell,
              {
                backgroundColor: pressed
                  ? myFont.buttonPressedColor
                  : myFont.white,
                position: "relative",
              }]}>
            <View style={styles.label}>
              <Text style={styles.text}>STATUS *</Text>
            </View>
            <StatusPicker
              setStatus={onChangeStatus}
              editMode={false}
            />
          </Pressable>
        </View>
        <View
          style={[
            styles.groupRow,
            { flexDirection: "row" }
          ]}>
          <Pressable
            style={({ pressed }) => [
              styles.halfCell,
              {
                backgroundColor: pressed
                  ? myFont.buttonPressedColor
                  : myFont.white,
                position: "relative",
              }]}>
            <View style={styles.label}>
              <Text style={styles.text}>TRACKER *</Text>
            </View>
            <TrackerPicker
              setTracker={onChangeTracker}
            />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.halfCell,
              {
                backgroundColor: pressed
                  ? myFont.buttonPressedColor
                  : myFont.white,
                position: "relative",
              }]}>
            <View style={styles.label}>
              <Text style={styles.text}>PRIORITY *</Text>
            </View>
            <PriorityPicker
              setPriority={onChangePriority}
            />
          </Pressable>
        </View>
        <View
          style={[
            styles.groupRow,
            { flexDirection: "row" }
          ]}>
          <Pressable
            style={({ pressed }) => [
              styles.halfCell,
              {
                backgroundColor: pressed
                  ? myFont.buttonPressedColor
                  : myFont.white,
                position: "relative",
              }]}>
            <View style={styles.label}>
              <Text style={styles.text}>% DONE</Text>
            </View>
            <DoneRatioPicker
              setDoneRatio={onChangeDoneRatio}
            />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.halfCell,
              {
                backgroundColor: pressed
                  ? myFont.buttonPressedColor
                  : myFont.white
              }]}>
            <View style={styles.label}>
              <Text style={styles.text}>PRIVATE</Text>
            </View>
            <CheckBox
              disabled={false}
              value={isPrivate}
              onValueChange={(newValue) => setIsPrivate(newValue)}
              style={{ marginLeft: 4 }}
            />
          </Pressable>
        </View>
        <View style={styles.groupRow}>
          <Pressable
            style={({ pressed }) =>
              [{
                backgroundColor: pressed
                  ? myFont.buttonPressedColor
                  : myFont.white
              }]}>
            <View style={styles.groupCell}>
              <View style={styles.label}>
                <Text style={styles.text}>Attach files</Text>
              </View>
            </View>
          </Pressable>
          <View style={{ width: "50%", alignSelf: "center" }}>
            <Button
              title="Upload files"
              onPress={() => uploadFile()}
            ></Button>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button
          title="SAVE"
          onPress={() => saveData()}
          color={myFont.green} />
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
  footer: {
    borderTopColor: myFont.footerBorderColor,
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    padding: 10,
    borderTopWidth: 1,
    borderColor: myFont.itemBorderColor,
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
});
