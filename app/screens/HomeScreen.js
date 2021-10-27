import React, { useState, useEffect } from 'react';
import { 
  ActivityIndicator, 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ScrollView, 
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Header from "../components/Header";
import HomeTiles from "../components/HomeTiles";
import myFont from '../config/myFont';

export default function HomeScreen({ navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [milestoneAmount, setMilestoneAmount] = useState(0);
  const [overdueAmount, setOverdueAmount] = useState(0);
  const [expAmount, setExpAmount] = useState(0);
  const [assignmentAmount, setAssignmentAmount] = useState(0);
  const [myToDoAmount, setMyToDoAmount] = useState(0);
  const [openProjectAmount, setOpenProjectAmount] = useState(0);

  const getInfo = async () => {
    try {
      const response = await fetch('http://192.168.1.50:80/redmine/projects.json');
      const json = await response.json();
      setOpenProjectAmount(json["total_count"]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getInfo();
  }, []);

	return (
		<SafeAreaView style={styles.container}>
      {isLoading? <ActivityIndicator/> : (
        <>
          <View style={styles.header}>
            <Pressable
              onPress={() => navigation.toggleDrawer()}
              style={styles.menuContainer}
            >
              <View>
                <Ionicons name="ios-menu" size={myFont.menuIconSize} color="white" />
              </View>
            </Pressable>
            <Text style={styles.textHeader}>Redmine</Text>
          </View>
          {/* <Header title="Redmine"/> */}
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
                navigation.navigate("OpenProjectStack", { amount: openProjectAmount })
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
            {/* "Recently projects closed" tile for projects closed within 3 days
            <Pressable
              onPress={() => {
                navigation.navigate("RecentClosed")
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
              <HomeTiles title="Recently projects closed" amount="1" />
            </Pressable>
            */}
            
          </ScrollView>
        </>
      )}
    </SafeAreaView>
	);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
		width: "100%",
		height: 50,
		backgroundColor: myFont.darkColor,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
	},
  menuContainer: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  textHeader: {
    color: myFont.white,
    fontSize: myFont.fontHomeHeaderSize,
		fontWeight: myFont.fontWeight,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    letterSpacing: myFont.letterSpace,
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