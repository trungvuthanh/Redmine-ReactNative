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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import myFont from '../config/myFont';
import StatusPicker from '../components/StatusPicker';

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

export default function AddScreen({ navigation }) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [code, onChangeCode] = useState("");
  const [name, onChangeName] = useState("");
  const startDate = dateInput(new Date());
  const endDate = dateInput(new Date());
  const [duration, onChangeDuration] = useState(Math.abs((endDate.date.getTime() - startDate.date.getTime()) / (1000 * 60 * 60 * 24) + 1));
  const [status, onChangeStatus] = useState(1);

  const onSubmitDuration = (duration) => {
    onChangeDuration(duration);
    // setEndDate(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + duration - 1));
    endDate.onChange(e, new Date(startDate.date.getFullYear(), startDate.date.getMonth(), startDate.date.getDate() + duration - 1));
  }

  const onChangeStart = (event, selectedDate) => {
    startDate.onChange(event, selectedDate);
    if (selectedDate <= endDate.date) {
      onChangeDuration(Math.abs((endDate.date.getTime() - selectedDate.getTime()) / (1000 * 60 * 60 * 24) + 1));
    }
  }
  const onChangeEnd = (event, selectedDate) => {
    endDate.onChange(event, selectedDate);
    if (selectedDate >= startDate.date) {
      onChangeDuration(Math.abs((selectedDate.getTime() - startDate.date.getTime()) / (1000 * 60 * 60 * 24) + 1));
    }
  }

  const changeModalVisibility = (bool) => {
    setIsModalVisible(bool);
  }
  const setStatus = (option) => {
    onChangeStatus(option);
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
          <Text style={styles.textHeader}>Project data</Text>
        </View>

        <ScrollView>
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
                  <Text style={styles.text}>code</Text>
                </View>
                <TextInput
                  style={styles.textInput}
                  textAlignVertical="center"
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
                  <Text style={styles.text}>name*</Text>
                </View>
                <TextInput
                  style={styles.textInput}
                  textAlignVertical="center"
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
                    {minHeight: 100, fontFamily: "monospace"},
                  ]} 
                  multiline={true} 
                  textAlignVertical="top"
                />
              </View>
            </Pressable>
          </View>
          <View 
            style={[
              styles.groupRow,
              {height: 74, flexDirection: "row"}
            ]}
          >
            <Pressable
              onPress={startDate.showDatepicker}
              style={styles.halfCell}
            >
              <View style={styles.label}>
                <Text style={styles.text}>start</Text>
              </View>
              <View style={styles.textDate}>
                <Text style={{fontSize: 20.8}}>{startDate.date.toLocaleDateString()}</Text>
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
                <Text style={styles.text}>end</Text>
              </View>
              <View style={styles.textDate}>
                <Text style={{fontSize: 20.8}}>{endDate.date.toLocaleDateString()}</Text>
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
              {height: 74, flexDirection: "row"}
            ]}
          >
            <Pressable
              onPress={() => {}}
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
                <Text style={styles.text}>duration</Text>
              </View>
              <Text style={styles.textInput}>{duration}</Text>
            </Pressable>
            <Pressable
              onPress={() => {}}
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
                <Text style={styles.text}>status</Text>
              </View>
              <Pressable
                onPress={() => changeModalVisibility(true)}
                style={[styles.statusTouch, {backgroundColor: myFont.statusColor[status - 1]}]}
              />
              <View style={{position: "absolute"}}>
                <Modal
                  transparent={true}
                  visible={isModalVisible}
                  onRequestClose={() => changeModalVisibility(false)}
                >
                  <StatusPicker
                    changeModalVisibility={changeModalVisibility}
                    currentStatus={status}
                    setStatus={setStatus}
                  />
                </Modal>
              </View>
            </Pressable>
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
            onPress={() => {}}
            style={({pressed}) => [
              {
                backgroundColor: pressed
                  ? myFont.buttonPressedColor
                  : myFont.addButtonColor
              },
              styles.saveButton
            ]}
          >
            {/* <Ionicons name="add" size={40} color={myFont.white} /> */}
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
  saveButton: {
    height: 50,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: myFont.addButtonColor,
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
    // position: "absolute",
    // bottom: 0,
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
})