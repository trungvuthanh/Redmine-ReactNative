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

import Header from "../components/Header";
import HomeTiles from "../components/HomeTiles";
import myFont from '../config/myFont';

export default function HomeScreen({ navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [overdueAmount, setOverdueAmount] = useState(0);
  const [expAmount, setExpAmount] = useState(0);
  const [issueAmount, setIssueAmount] = useState(0);
  const [issues, setIssues] = useState([]);
  const [myIssueAmount, setMyIssueAmount] = useState(0);
  const [myIssues, setMyIssues] = useState([]);
  const [openProjectAmount, setOpenProjectAmount] = useState(0);

  // pull to refresh function
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getProjects()
    .then(getIssues())
    .then(() => {
      setRefreshing(false);
    });
  }, []);

  const getProjects = async () => {
    try {
      const response = await fetch('http://192.168.1.50:80/redmine/projects.json');
      const json = await response.json();
      let count = 0;
      for (let project of json.projects) {
        if (project.id != 1 && project.parent == undefined) count += 1;
      }
      setOpenProjectAmount(count);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const getIssues = async () => {
    fetch('http://192.168.1.50:80/redmine/issues.json?status_id=*')
    .then((response) => response.json())
    .then((json) => {
      setIssueAmount(json.total_count);
      setIssues(json.issues);
      let myIssueCount = 0;
      let myIssuesArr = []
      for (let issue of json.issues) {
        if (issue.assigned_to) {
          myIssueCount += 1;
          myIssuesArr.push(issue);
        }
      }
      setMyIssues(myIssuesArr);
      setMyIssueAmount(myIssueCount);
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => setLoading(false));
  }

  useEffect(() => {
    getProjects()
    .then(getIssues());
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
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
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
              <HomeTiles redMark="yes" title="Overdue issues" amount={overdueAmount} />
            </Pressable>
            {/* <Pressable
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
              <HomeTiles redMark="yes" title="Expired Issue" amount={expAmount} />
            </Pressable> */}
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
                }
              ]}
            >
              <HomeTiles redMark="no" title="Issues" amount={issueAmount} />
            </Pressable>
            <Pressable
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
                navigation.navigate("OpenProjectStack")
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