import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { get_issues } from '../api/issue_api';
import myFont from '../config/myFont';

export default function ClosedScreen({ route, navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [issueAmount, setIssueAmount] = useState(0);
  const [closedIssues, setClosedIssues] = useState([]);
    
  const syncData = async () => {
    get_issues()
    .then((data) => {
      let closedIssuesCount = 0;
      let closedIssuesArr = []
      for (let issue of data.issues) {
        if (issue.status.id == 5) {
          closedIssuesCount += 1;
          closedIssuesArr.push(issue);
        }
      }
      setIssueAmount(closedIssuesCount);
      setClosedIssues(
        closedIssuesArr.map((issue, index) => {
          return (
            <View key={index}>
              <Pressable
                onPress={() => navigation.navigate("DetailScreen", { type: 'issue' , issue: issue })}
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
                  <Text>(#{issue.id})</Text>
                </View>
              </Pressable>
            </View>  
          );
        })
      );
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => setLoading(false));
  }

  useEffect(() => {
    syncData();
  }, []);
  
  // pull to refresh function
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    syncData()
    .then(setRefreshing(false));
  }, []);

	return (
    <>
      <SafeAreaView style={styles.container}>
        {isLoading ? <ActivityIndicator/> :
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
              <Text style={styles.textHeader}>
                Closed Issues
                <Text style={{fontSize: 18.6, letterSpacing: myFont.letterSpace}}> ({issueAmount})</Text>
              </Text>
            </View>
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              {closedIssues}
            </ScrollView>
          </>
        }
      </SafeAreaView>
    </>
	);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  statusContainer: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});
