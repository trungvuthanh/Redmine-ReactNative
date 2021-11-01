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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import CheckBox from '@react-native-community/checkbox';

import myFont from '../config/myFont';
import TrackerPicker from '../components/TrackerPicker';
import PriorityPicker from '../components/PriorityPicker';
import StatusPicker from '../components/StatusPicker';
import ParentProjectPicker from '../components/ParentProjectPicker';
import ParentIssuePicker from '../components/ParentIssuePicker';
import DoneRatioPicker from '../components/DoneRatioPicker';

function dateInput() {
  const [date, setDate] = useState(new Date());
  // const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  // const showMode = (currentMode) => {
  //   setShow(true);
  //   setMode(currentMode);
  // };
  const showDatepicker = () => {
    // showMode('date');
    setShow(true);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date
    // setShow(Platform.OS === 'ios');
    setShow(false);
    setDate(currentDate);
  }
  return {
    date,
    // mode,
    show,
    showDatepicker,
    onChange
  }
}

export default function AddScreen({ route, navigation }) {
  const type = route.params.type;
  let projects = [], issues = [];
  let parent_id;
  if (type === 'project') {
    projects = route.params.projects
  } else if (type === 'issue') {
    issues = route.params.issues;
    parent_id = route.params.parent_id;
  }
    
  // General
  const [name, onChangeName] = useState("");
  const [description, onChangeDescription] = useState("");
  const [subproject, onChangeSubProject] = useState(type === 'issue' ? {subject: "", id: 0} : {name: "", id: 0});
  const [isSubVisible, setIsSubVisible] = useState(false);
  const changeSubVisibility = (bool) => {
    setIsSubVisible(bool);
  }
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
  const onChangeStart = (event, selectedDate) => {
    startDate.onChange(event, selectedDate);
    console.log(startDate.date.toLocaleDateString());
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
          style: "cancel"
        }]
      );
    }
    
  }

  const createData = async () => {
    if (type === 'project') {
      let body;
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
      fetch("http://192.168.1.50:80/redmine/projects.json", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Redmine-API-Key': '34dafb931f5817ecf25be180ceaf87029142915e',
        },
        body: body,
      })
      .then((response) => {
        console.log(response.status);
        if (response.status == 201) Alert.alert(
          "Project was created",
          "",
        );
      })
      .then(() => {
        navigation.goBack();
      })
      .catch((error) => {
        console.error(error);
      });
    } else if (type === 'issue') {
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
          assigned_to_id: 1,
          is_private: isPrivate,
          estimated_hours: duration,
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
          assigned_to_id: 1,
          is_private: isPrivate,
          estimated_hours: duration,
          start_date: standardDate(startDate.date),
          due_date: standardDate(endDate.date),
          done_ratio: doneRatio,
        }
      });
      fetch("http://192.168.1.50:80/redmine/issues.json", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Redmine-API-Key': '34dafb931f5817ecf25be180ceaf87029142915e',
        },
        body: body,
      })
      .then((response) => {
        console.log(response.status);
        if (response.status == 201) Alert.alert(
          "Issue was added",
          "",
        );
      })
      .then(() => {
        navigation.goBack();
      })
      .catch((error) => {
        console.error(error);
      });
    }
  }

  return (
    // <SafeAreaView>
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
                      <Text style={styles.text}>name *</Text>
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
                      <Text style={styles.text}>identifier *</Text>
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
                      <Text style={styles.text}>description</Text>
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
                      <Text style={styles.text}>subproject of</Text>
                      <Pressable
                        onPress={() => onChangeSubProject({name: "", id: 0})}
                      >
                        <Text
                          style={{color: myFont.blue}}
                        >Clear</Text>
                      </Pressable>
                    </View>
                    <Pressable
                      onPress={() => changeSubVisibility(true)}
                    >
                      <Text style={styles.textInput}>{subproject.name}</Text>
                    </Pressable>
                    <View>
                      <Modal
                        transparent={true}
                        visible={isSubVisible}
                        onRequestClose={() => changeSubVisibility(false)}
                      >
                        <ParentProjectPicker
                          changeSubVisibility={changeSubVisibility}
                          setSub={setSubProject}
                          projectList={projects}
                        />
                      </Modal>
                    </View>
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
                    <Text style={styles.text}>is public</Text>
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
                    }
                  ]}
                >
                  <View style={styles.label}>
                    <Text style={styles.text}>inherit members</Text>
                  </View>
                  <CheckBox
                    disabled={false}
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
                  }]
                }
                >
                  <View style={styles.groupCell}>
                    <View style={styles.label}>
                      <Text style={styles.text}>subject *</Text>
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
                      <Text style={styles.text}>description</Text>
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
                      <Text style={styles.text}>Parent task</Text>
                      <Pressable
                        onPress={() => onChangeSubProject({subject: "", id: 0})}
                      >
                        <Text
                          style={{color: myFont.blue}}
                        >Clear</Text>
                      </Pressable>
                    </View>
                    <Pressable
                      onPress={() => changeSubVisibility(true)}
                    >
                      <Text style={styles.textInput}>{subproject.subject}</Text>
                    </Pressable>
                    <View>
                      <Modal
                        transparent={true}
                        visible={isSubVisible}
                        onRequestClose={() => changeSubVisibility(false)}
                      >
                        <ParentIssuePicker
                          changeSubVisibility={changeSubVisibility}
                          setSub={setSubProject}
                          issueList={issues}
                        />
                      </Modal>
                    </View>
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
                    <Text style={styles.text}>start date</Text>
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
                    <Text style={styles.text}>due date</Text>
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
                    <Text style={styles.text}>estimated time (h)</Text>
                  </View>
                  <TextInput
                    style={styles.textInput}
                    textAlignVertical="center"
                    value={duration}
                    onChangeText={(value) => onChangeDuration(parseInt(value))}
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
                    <Text style={styles.text}>status *</Text>
                  </View>
                  <Pressable
                    onPress={() => changeStatusVisibility(true)}
                    style={[styles.statusTouch, {backgroundColor: myFont.statusColor[status - 1]}]}
                  />
                  <View>
                    <Modal
                      transparent={true}
                      visible={isStatusVisible}
                      onRequestClose={() => changeStatusVisibility(false)}
                    >
                      <StatusPicker
                        changeStatusVisibility={changeStatusVisibility}
                        setStatus={onChangeStatus}
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
                    <Text style={styles.text}>tracker *</Text>
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
                    <Text style={styles.text}>priority *</Text>
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
                    <Text style={styles.text}>% done</Text>
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
                    <Text style={styles.text}>private</Text>
                  </View>
                  <CheckBox
                    disabled={false}
                    value={isPrivate}
                    onValueChange={(newValue) => setIsPrivate(newValue)}
                    style={{marginLeft: 4}}
                  />
                </Pressable>
              </View>
            </>
          }
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={({pressed}) => [
              {
                backgroundColor: pressed
                ? myFont.buttonPressedColor
                : myFont.footerBackgroundColor
              },
              styles.backButton
            ]}
          >
            <Ionicons name="chevron-back" size={30} color={myFont.blue} />
          </Pressable>
          <Pressable
            onPress={() => saveData()}
            style={({pressed}) => [
              {
                backgroundColor: pressed
                  ? myFont.buttonPressedColor
                  : myFont.addButtonColor
              },
              styles.saveButton
            ]}
          >
            <Text style={styles.saveText}>save</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    // </SafeAreaView>
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
  saveText: {
    fontSize: 16,
    color: myFont.white,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  backButton: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    backgroundColor: myFont.footerBackgroundColor,
    borderTopColor: myFont.footerBorderColor,
    width: "100%",
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 0,
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
    fontWeight: "400",
    textTransform: "uppercase"
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
    fontWeight: "400",
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