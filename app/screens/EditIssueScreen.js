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
import DateTimePicker from '@react-native-community/datetimepicker';
import CheckBox from '@react-native-community/checkbox';
import DocumentPicker from 'react-native-document-picker';

import myFont from '../config/myFont';
import TrackerPicker from '../components/TrackerPicker';
import PriorityPicker from '../components/PriorityPicker';
import StatusPicker from '../components/StatusPicker';
import ParentIssuePicker from '../components/ParentIssuePicker';
import DoneRatioPicker from '../components/DoneRatioPicker';

function dateInput(dateStr) {
  const [date, setDate] = useState(new Date(dateStr));
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

export default function EditIssueScreen({ route, navigation }) {
  let issue = route.params.issue
  let issues = [];
  let parentIssue = {subject: "", id: 0};
  
  issues = route.params.issues; // issues of parent project
  if (issue.parent) {
    for (let iss of issues) {
      if (iss.id == issue.parent.id) {
        parentIssue.subject = iss.subject;
        parentIssue.id = iss.id;
      }
    }
  }
    
  // General
  const [name, onChangeName] = useState(issue.subject);
  const [description, onChangeDescription] = useState(issue.description);
  const [subproject, onChangeSubProject] = useState(parentIssue);
  const [isSubVisible, setIsSubVisible] = useState(false);
  const changeSubVisibility = (bool) => {
    setIsSubVisible(bool);
  }
  const setSubProject = (option) => {
    onChangeSubProject(option);
  }

  // Issue
  const startDate = dateInput(issue.start_date);
  const endDate = dateInput(issue.due_date);
  const [duration, onChangeDuration] = useState(
    issue.estimated_hours
    ? issue.estimated_hours.toString()
    : ''
  );
  const [status, onChangeStatus] = useState(issue.status.id);
  const [isStatusVisible, setIsStatusVisible] = useState(false);
  const [tracker, onChangeTracker] = useState({name: issue.tracker.name, id: issue.tracker.id});
  const [isTrackerVisible, setIsTrackerVisible] = useState(false);
  const [priority, onChangePriority] = useState({name: issue.priority.name, id: issue.priority.id});
  const [isPriorityVisible, setIsPriorityVisible] = useState(false);
  const [doneRatio, onChangeDoneRatio] = useState(issue.done_ratio);
  const [isDoneRatioVisible, setIsDoneRatioVisible] = useState(false);
  const [isPrivate, setIsPrivate] = useState(issue.is_private);
  const statusLabels = ['New', 'In Progress', 'Resolved', 'Feedback', 'Closed', 'Rejected'];
    
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
    name != ""
    ? updateData()
    :  Alert.alert(
      "Name cannot be blank",
      "",
      [{
        text: "OK",
        style: "cancel",
      }]
    );
  }

  const updateData = async () => {
    let body = JSON.stringify({
      issue: {
        project_id: issue.project.id,
        tracker_id: tracker.id,
        status_id: status,
        priority_id: priority.id,
        subject: name,
        description: description,
        parent_issue_id: subproject.subject == '' ? null : subproject.id,
        assigned_to_id: 1,
        is_private: isPrivate,
        estimated_hours: duration ? null : parseInt(duration),
        start_date: standardDate(startDate.date),
        due_date: standardDate(endDate.date),
        done_ratio: doneRatio,
      }
    });
    fetch('http://192.168.1.50:80/redmine/issues/' + issue.id + '.json', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Redmine-API-Key': '34dafb931f5817ecf25be180ceaf87029142915e',
      },
      body: body,
    })
    .then((response) => {
      console.log(response.status);
      if (response.status == 204) {
        Alert.alert(
          "Issue edited successfully",
          "",
          [{
            text: 'OK',
            style: 'cancel',
            onPress: () => navigation.goBack(),
          }]
        );  
      } else {
        Alert.alert(
          "Fail to edit issue",
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
          <Text style={styles.textHeader}>Edit issue</Text>
      </View>

      <ScrollView style={{marginBottom: 50}}>
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
                <Text style={styles.text}>subject *</Text>
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
              <Text style={styles.text}>status *</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Pressable
                onPress={() => changeStatusVisibility(true)}
                style={[styles.statusTouch, {backgroundColor: myFont.statusColor[status - 1]}]}
              />
              <Text style={styles.textInput}>{statusLabels[status - 1]}</Text>
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
                  editMode={true}
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
    fontWeight: "300",
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