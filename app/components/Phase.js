import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable
} from 'react-native';
import Collapsible from 'react-native-collapsible';

import myFont from '../config/myFont';

// Phase is for root issues - issues have no parent issue
export default function Phase(props) {
  const issues = props.issues;

  const mylist = issues.map((issue, index) => {
    return (
      <Pressable
        key={index}
        onPress={() => props.navigateToIssue(issue)}
        style={({ pressed }) => [
          styles.tile,
          {
            backgroundColor: pressed
              ? myFont.buttonPressedColor
              : myFont.white
          }
        ]}>
        <View
          style={[styles.status, { backgroundColor: myFont.priorityColor[issue.priority.id - 1] }]}
        />
        <View style={styles.contentContainer}>
          <Text style={{ fontWeight: "700", fontSize: 20 }}>{issue.subject}</Text>
          <Text style={{ fontSize: 16 }}>#{issue.id}</Text>
        </View>
      </Pressable>
    );
  });

  return (
    <Collapsible
      collapsed={props.collapseIssue}>
      <View
        style={styles.addPhaseContainer}>
        <Pressable
          onPress={() => props.addNewIssue()}
          style={({ pressed }) => [
            {
              backgroundColor: pressed
                ? myFont.buttonPressedColor
                : myFont.white
            },
            styles.addPhaseButton
          ]}>
          <Text style={styles.addPhaseText}>New issue</Text>
        </Pressable>
      </View>
      {mylist}
    </Collapsible>
  );
}

const styles = StyleSheet.create({
  addPhaseContainer: {
    width: "100%",
    paddingHorizontal: 2,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: myFont.itemBorderColor,
    backgroundColor: myFont.white,
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
  contentContainer: {
    justifyContent: "center",
    padding: 10,
  },
  status: {
    width: 20,
    height: 74,
  },
  tile: {
    width: "100%",
    height: 74,
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: myFont.itemBorderColor,
    alignItems: "center",
    flexDirection: "row",
  }
});
