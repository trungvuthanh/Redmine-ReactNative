import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable
} from 'react-native';
import Collapsible from 'react-native-collapsible';

import myFont from '../config/myFont';

export default function SubProject(props) {
  const projects = props.projects;
  
  const mylist = projects.map((project, index) => {
    return (
      <Pressable
        key={index}
        onPress={() => props.navigateTo(project)}
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
            style={[styles.status, {backgroundColor: myFont.statusColor[project.status - 1]}]}
          />
        </View>
        <View>
          <Text>{project.name}</Text>
          <Text>(#{project.id})</Text>
          {/* {issue.parent ? <Text>Parent id: ({issue.parent.id})</Text> : <></>} */}
        </View>
      </Pressable>
    );
  });

  return (
    <Collapsible 
      collapsed={props.collapseSubproject}
    >
      <View
        style={styles.addPhaseContainer}
      >
        <Pressable
          onPress={() => props.addSubProject()}
          style={({pressed}) => [
            {
              backgroundColor: pressed
              ? myFont.buttonPressedColor
              : myFont.white
            },
            styles.addPhaseButton
          ]}
        >
          <Text style={styles.addPhaseText}>Add subproject</Text>
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