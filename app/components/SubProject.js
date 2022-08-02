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

  const projectList = projects.map((project, index) => {
    return (
      <Pressable
        key={index}
        onPress={() => props.navigateTo(project)}
        style={({ pressed }) => [
          styles.tile,
          {
            backgroundColor: pressed
              ? myFont.buttonPressedColor
              : myFont.white
          }
        ]}>
        <View>
          <Text style={{ fontWeight: "700", fontSize: 20 }} >{project.name}</Text>
          <Text style={{ fontSize: 16 }}>#{project.id}</Text>
        </View>
      </Pressable>
    );
  });

  return (
    <Collapsible
      collapsed={props.collapseSubProject}>
      <View
        style={styles.addPhaseContainer}>
        <Pressable
          onPress={() => props.addSubProject()}
          style={({ pressed }) => [
            {
              backgroundColor: pressed
                ? myFont.buttonPressedColor
                : myFont.white
            },
            styles.addPhaseButton
          ]}>
          <Text style={styles.addPhaseText}>Add subproject</Text>
        </Pressable>
      </View>
      {projectList}
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
  tile: {
    width: "100%",
    height: 74,
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: myFont.itemBorderColor,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
  }
});
