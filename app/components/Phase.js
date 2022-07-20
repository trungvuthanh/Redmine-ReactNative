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
    if (issue.parent == undefined) {
      return (
        <Pressable
          key={index}
          onPress={() => props.navigateToIssue(issue)}
          style={({pressed}) => [
            {
              width: "100%",
              height: 74,
              borderStyle: "solid",
              borderBottomWidth: 1,
              borderBottomColor: myFont.itemBorderColor,
              alignItems: "center",
              flexDirection: "row",
            },
            {
              backgroundColor: pressed
              ? myFont.buttonPressedColor
              : myFont.white
            }
          ]}
        >
          <View style={styles.statusContainer}>
            <View
              style={[styles.status, {backgroundColor: myFont.statusColor[issue.status.id - 1]}]}
            />
          </View>
          <View>
            <Text>{issue.subject}</Text>
            <Text>#{issue.id}</Text>
          </View>
        </Pressable>
      );
    }
  });

  return (
    <Collapsible 
      collapsed={props.collapseIssue}
    >
      <View
        style={styles.addPhaseContainer}
      >
        <Pressable
          onPress={() => props.addNewPhase()}
          style={({pressed}) => [
            {
              backgroundColor: pressed
              ? myFont.buttonPressedColor
              : myFont.white
            },
            styles.addPhaseButton
          ]}
        >
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
})