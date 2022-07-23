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

import { get_issues_assigned_to_user } from '../api/issue_api';
import myFont from '../config/myFont';

export default function MyIssueScreen({ route, navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [issueAmount, setIssueAmount] = useState(0);
  const [issues, setIssues] = useState([]);

  const syncData = async () => {
    get_issues_assigned_to_user()
    .then((data) => {
      setIssueAmount(data.total_count);
      setIssues(
        data.issues.map((issue, index) => {
          return (
            <View style={styles.contentView} key={index}>
              <Pressable
                onPress={() => navigation.navigate("DetailScreen", { type: 'issue' , issue: issue })}
                style={({pressed}) => [
                  styles.tile,
                  {
                    backgroundColor: pressed
                    ? myFont.buttonPressedColor
                    : myFont.white
                  }
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center"}}>
                  <View style={[
                    styles.statusContainer,
                    {backgroundColor: myFont.statusColor[issue.status.id - 1]}
                    ]}/>
                  <View>
                    <Text
                      style={{
                        fontWeight: "700",
                        fontSize: 20}}>
                        {issue.subject}</Text>
                    <Text>#{issue.id}</Text>
                  </View>
                </View>
                <View style={{alignItems: "center", width: "21%", marginRight: 10}} >
                  <View
                    style={{
                      width: "100%",
                      borderRadius: 5,
                      padding: 1,
                      marginBottom: 5,
                      backgroundColor: myFont.priorityColor[issue.priority.id - 1],
                      alignItems: "center"}}>
                    <Text
                      style={{
                        color: myFont.black,
                        fontWeight: "700"
                      }}>
                        {issue.priority.name}</Text>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      borderRadius: 5,
                      padding: 1,
                      backgroundColor: myFont.white,
                      alignItems: "center"}}>
                    <Text
                      style={{
                        fontWeight: "700",
                        color: myFont.statusColor[issue.status.id - 1]}}>
                          {issue.status.name}</Text>
                  </View>
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
                Assigned Issues
                <Text style={{fontSize: 18.6, letterSpacing: myFont.letterSpace}}> ({issueAmount})</Text>
              </Text>
            </View>
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              {issues}
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
    backgroundColor: "#ecedee",
  },
  contentView: {
    alignItems: "center",
    padding: 7,
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
  tile: {
    width: "100%",
    height: 74,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 5,
  },
  statusContainer: {
    width: 10,
    height: 74,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
});
