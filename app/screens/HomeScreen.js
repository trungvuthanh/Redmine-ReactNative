import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator, 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ScrollView, 
  Pressable,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { get_projects } from '../api/project_api';
import { get_issues } from '../api/issue_api';
import myFont from '../config/myFont';

import HomeTiles from "../components/HomeTiles";

export default function HomeScreen({ navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [overdueAmount, setOverdueAmount] = useState(0);
  const [issueAmount, setIssueAmount] = useState(0);
  const [projectAmount, setProjectAmount] = useState(0);

  /*
  Get number of root projects
  */
  const getProjectAmount = async () => {
    get_projects()
      .then((data) => {
          let count = 0;
          for (let project of data.projects) {
            if (project.id != 1 && project.parent == undefined) count += 1;
          }
          setProjectAmount(count);
        })
          .catch((error) => {
              console.error(error);
            })
              .finally(() => setLoading(false));
  }

  /*
  Get number of assigned issues
  */
  const getIssueAmount = async () => {
    get_issues()
      .then((data) => {
          let myIssueCount = 0;
          let myIssuesArr = []
          let overdueIssuesCount = 0;
          let today = new Date();
          for (let issue of data.issues) {
            if (issue.assigned_to) {
              myIssueCount += 1;
              myIssuesArr.push(issue);
            }
            if (issue.due_date) {
              let dueDate = new Date(issue.due_date);
              if (dueDate < today) overdueIssuesCount += 1;
            }
          }
          setIssueAmount(myIssueCount);
          setOverdueAmount(overdueIssuesCount);
        })
          .catch((error) => {
              console.error(error);
            })
              .finally(() => setLoading(false));
  }

  // pull to refresh function
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getProjectAmount()
      .then(getIssueAmount())
        .then(setRefreshing(false));
  }, []);

  useEffect(() => {
    getProjectAmount()
      .then(getIssueAmount());
  }, []);

	return (
		<SafeAreaView style={styles.container}>
      {isLoading? <ActivityIndicator/> :
        <>
          <View style={styles.header}>
            <Pressable
              onPress={() => navigation.toggleDrawer()}
              style={styles.menuContainer}>
              <View>
                <Ionicons name="ios-menu" size={myFont.menuIconSize} color="white" />
              </View>
            </Pressable>
            <Text style={styles.textHeader}>Redmine</Text>
          </View>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            <Pressable
              onPress={() => {
                navigation.navigate("OverdueStack")
              }}
              style={({ pressed }) => [
                styles.tiles,
                {
                  backgroundColor: pressed
                    ? myFont.buttonPressedColor
                    : myFont.white
                }]}>
              <HomeTiles redMark="yes" title="Overdue issues" amount={overdueAmount} />
            </Pressable>
            <Pressable
              onPress={() => {
                navigation.navigate("IssueStack")
              }}
              style={({ pressed }) => [
                styles.tiles,
                {
                  backgroundColor: pressed
                    ? myFont.buttonPressedColor
                    : myFont.white
                }]}>
              <HomeTiles redMark="no" title="Issues" amount={issueAmount} />
            </Pressable>
            {/* <Pressable
              onPress={() => {
                navigation.navigate("MyIssueStack")
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
              <HomeTiles redMark="no" title="My Issues" amount={myIssueAmount} />
            </Pressable> */}
            <Pressable
              onPress={() => {
                navigation.navigate("ProjectStack")
              }}
              style={({ pressed }) => [
                styles.tiles,
                {
                  backgroundColor: pressed
                    ? myFont.buttonPressedColor
                    : myFont.white
                }]}>
              <HomeTiles redMark="no" title="Projects" amount={projectAmount} />
            </Pressable>
          </ScrollView>
        </>
      }
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
