import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Pressable } from 'react-native';

import Header from "../components/Header";
import HomeTiles from "../components/HomeTiles";
import myFont from '../config/myFont';

export default function HomeScreen({ navigation }) {
  const [milestoneAmount, setMilestoneAmount] = useState(0);
  const [overdueAmount, setOverdueAmount] = useState(0);
  const [expAmount, setExpAmount] = useState(0);
  const [assignmentAmount, setAssignmentAmount] = useState(0);
  const [myToDoAmount, setMyToDoAmount] = useState(0);
  const [openProjectAmount, setOpenProjectAmount] = useState(0);

	return (
		<SafeAreaView style={styles.container}>
      <Header title="Redmine"/>
      <ScrollView>
        <Pressable
          onPress={() => {
            navigation.navigate("Milestone", { amount: milestoneAmount })
          }}
          style={({ pressed }) => [
            styles.tiles,
            {
              backgroundColor: pressed
                ? myFont.buttonPressedColor
                : myFont.white
            }
          ]}
        >
          <HomeTiles redMark="yes" title="Milestones overdue" amount={milestoneAmount} />
        </Pressable>
        <Pressable
          onPress={() => {
            navigation.navigate("Overdue", { amount: overdueAmount })
          }}
          style={({ pressed }) => [
            styles.tiles,
            {
              backgroundColor: pressed
                ? myFont.buttonPressedColor
                : myFont.white
            }
          ]}
        >
          <HomeTiles redMark="yes" title="Overdue project" amount={overdueAmount} />
        </Pressable>
        <Pressable
          onPress={() => {
            navigation.navigate("Expired", { amount: expAmount })
          }}
          style={({ pressed }) => [
            styles.tiles,
            {
              backgroundColor: pressed
                ? myFont.buttonPressedColor
                : myFont.white
            }
          ]}
        >
          <HomeTiles redMark="yes" title="Expired ToDo" amount={expAmount} />
        </Pressable>
        <Pressable
          onPress={() => {
            navigation.navigate("Assignment", { amount: assignmentAmount })
          }}
          style={({ pressed }) => [
            styles.tiles,
            {
              backgroundColor: pressed
                ? myFont.buttonPressedColor
                : myFont.white
            }
          ]}
        >
          <HomeTiles redMark="no" title="My assignments" amount={assignmentAmount} />
        </Pressable>
        <Pressable
          onPress={() => {
            navigation.navigate("MyToDo", { amount: myToDoAmount })
          }}
          style={({ pressed }) => [
            styles.tiles,
            {
              backgroundColor: pressed
                ? myFont.buttonPressedColor
                : myFont.white
            }
          ]}
        >
          <HomeTiles redMark="no" title="My ToDo" amount={myToDoAmount} />
        </Pressable>

        {/* "Forthcoming ends" tile for projects about to reach due date
        <Pressable
          onPress={() => {
            navigation.navigate("Forthcoming")
          }}
          style={({ pressed }) => [
            styles.tiles,
            {
              backgroundColor: pressed
                ? myFont.buttonPressedColor
                : myFont.white
            }
          ]}
        >
          <HomeTiles redMark="no" title="Forthcoming ends" amount="1" />
        </Pressable>
        */}

        <Pressable
          onPress={() => {
            navigation.navigate("OpenProject", { amount: openProjectAmount })
          }}
          style={({ pressed }) => [
            styles.tiles,
            {
              backgroundColor: pressed
                ? myFont.buttonPressedColor
                : myFont.white
            }
          ]}
        >
          <HomeTiles redMark="no" title="Open projects" amount={openProjectAmount} />
        </Pressable>

        {/* "Recently created projects" tile for projects created within 3 days
        <Pressable
          onPress={() => {
            navigation.navigate("RecentCreate")
          }}
          style={({ pressed }) => [
            styles.tiles,
            {
              backgroundColor: pressed
                ? myFont.buttonPressedColor
                : myFont.white
            }
          ]}
        >
          <HomeTiles title="Recently created projects" amount="1" />
        </Pressable>
        */}
        
      </ScrollView>
    </SafeAreaView>
	);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  amount: {
    fontSize: myFont.fontDashboardSize,
    fontWeight: myFont.fontWeight,
    color: myFont.black,
  },
  redMark: {
    width: 12,
    height: 44,
    backgroundColor: myFont.redMarkColor,
    position: "absolute",
  },
  text: {
    fontSize: myFont.fontDashboardSize,
    fontWeight: myFont.fontWeight,
    color: myFont.black,
  },
  textBox: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
    marginVertical: 10,
  },
  tiles: {
    position: "relative",
    width: "100%",
    height: 45,
    backgroundColor: myFont.white,
    paddingHorizontal: 25,
    flexDirection: "row",
    borderStyle: "solid",
    borderBottomWidth: 0.5,
    borderBottomColor: myFont.homeTileColor,
  },
});