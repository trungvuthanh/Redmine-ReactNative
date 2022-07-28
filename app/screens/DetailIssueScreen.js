import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Dimensions,
  Alert,
  Button
} from 'react-native';
import { Ionicons, Entypo } from '@expo/vector-icons';

import {
  get_issues_of_project,
} from '../api/project_api';
import {
  get_issue,
  delete_issue
} from '../api/issue_api';
import myFont from '../config/myFont';

import SubPhase from '../components/SubPhase';
import IssueInformation from '../components/IssueInformation';

const WIDTH = Dimensions.get('window').width;

export default function DetailIssueScreen({ route, navigation }) {
  let issue = route.params.issue;

  // Sub issues
  const [subIssueList, setSubIssueList] = useState([]);
  const [parentIssueList, setParentIssueList] = useState([]); // all issues of project
  const [collapseIssue, setCollapseIssue] = useState(true);
  const [collapseDetail, setCollapseDetail] = useState(false);
  const [issueCount, setIssueCount] = useState(0);
  const [isLoading, setLoading] = useState(false);

  // type === 'issue'
  const syncIssue = async () => {
    /*
    Get data of issue
    */
    get_issue(issue.id)
      .then((data) => {
        issue = data;
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  // type === 'issue'
  const syncIssuesOfIssue = async () => {
    /*
    Get subtasks of an issue
    */
    get_issues_of_project(issue.project.id)
      .then((data) => {
        try {
          setParentIssueList(data.issues);
          let issueCount = 0;
          let issueList = [];
          for (let iss of data.issues) {
            if (iss.parent != undefined && iss.parent.id == issue.id) {
              issueCount += 1;
              issueList.push(iss);
            }
          }
          setSubIssueList(issueList);
          setIssueCount(issueCount);
        } catch (error) {
          console.error(error);
          console.log('Server return no data')
        }
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
    // .then(syncIssue())
    syncIssuesOfIssue()
      .then(setRefreshing(false));
  }, []);

  useEffect(() => {
    syncIssuesOfIssue();
  }, []);

  const addNewIssue = () => {
    let parent_issue_list = subIssueList;
    parent_issue_list.splice(0, 0, issue);
    navigation.push('AddIssueScreen', {
      project_id: issue.project.id,
      parent_issue_list: parent_issue_list,
      parent_issue: issue
    });
  }

  const navigateToSubIssue = (issue) => {
    navigation.push('DetailIssueScreen', { issue: issue });
  }

  const deleteItem = async () => {
    delete_issue(issue.id)
      .then((response) => {
        console.log(response.status);
        if (response.status == 204) {
          Alert.alert(
            "Issue deleted successfully",
            "",
            [{
              text: 'OK',
              style: 'cancel',
              onPress: () => navigation.goBack(),
            }]
          );
        } else {
          Alert.alert(
            "Fail to delete issue",
            "",
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? <ActivityIndicator /> :
        <>
          <View style={styles.header}>
            <Pressable
              onPress={() => navigation.toggleDrawer()}
              style={styles.menuContainer}>
              <View>
                <Ionicons name="ios-menu" size={myFont.menuIconSize} color="white" />
              </View>
            </Pressable>
            <Text style={styles.textHeader}>Issue</Text>
          </View>
          <ScrollView
            style={{ marginBottom: 50 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            <View style={styles.nameHeader}>
              <View
                style={[
                  styles.statusContainer,
                  { backgroundColor: myFont.priorityColor[issue.priority.id - 1] }
                ]} />
              <View
                style={{
                  alignItems: "flex-start",
                  justifyContent: "center",
                  paddingHorizontal: 10,
                  width: WIDTH - 20,
                  height: 74,
                  backgroundColor: "white"
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    color: myFont.black,
                    fontWeight: "700"
                  }}
                  ellipsizeMode="clip">
                  {issue.subject}</Text>
                <Text
                  style={{ fontSize: 16, color: myFont.black }}>
                  #{issue.id}</Text>
              </View>
            </View>
            <View style={styles.groupRow}>
              <View style={[styles.halfCell, { minWidth: 150, width: "35%" }]}>
                <View style={styles.label}>
                  <Text style={styles.text}>START DATE:</Text>
                </View>
                <View style={[styles.textDate, { alignSelf: "center" }]}>
                  <Text style={{ fontSize: 20.8 }}>{issue.start_date.substring(0, 10).split('-').reverse().join('/')}</Text>
                </View>
              </View>
              <View style={[styles.halfCell, { minWidth: 150, width: "35%" }]}>
                <View style={styles.label}>
                  <Text style={styles.text}>DUE DATE:</Text>
                </View>
                <View style={[styles.textDate, { alignSelf: "center" }]}>
                  <Text style={{ fontSize: 20.8 }}>
                    {issue.due_date ? issue.due_date.substring(0, 10).split('-').reverse().join('/') : ''}
                  </Text>
                </View>
              </View>
              <View style={[styles.halfCell, { flex: 1 }]}>
                <View style={styles.label}>
                  <Text style={styles.text}>DONE</Text>
                </View>
                <View style={[styles.textDate, { alignSelf: "center" }]}>
                  <Text style={{ fontSize: 20.8 }}>{issue.done_ratio} %</Text>
                </View>
              </View>
            </View>
            <View style={{ borderColor: myFont.itemBorderColor, borderTopWidth: 1, borderBottomWidth: 1 }} >
              <Pressable
                onPress={() => setCollapseIssue(!collapseIssue)}>
                <View
                  style={styles.tile}>
                  <Text
                    style={[
                      styles.title,
                      { fontWeight: collapseIssue ? "300" : "700" }
                    ]}>
                    Subtasks ({issueCount})</Text>
                  {collapseIssue
                    ? <Entypo name="chevron-down" size={myFont.menuIconSize} color="#d2d4d7" />
                    : <Entypo name="chevron-up" size={myFont.menuIconSize} color="#d2d4d7" />}
                </View>
              </Pressable>
              <SubPhase collapseIssue={collapseIssue} issues={subIssueList} addNewIssue={addNewIssue} navigateToIssue={navigateToSubIssue} />
            </View>
            <View style={{ borderColor: myFont.itemBorderColor, borderTopWidth: 1, borderBottomWidth: 1 }} >
              <Pressable
                onPress={() => setCollapseDetail(!collapseDetail)}>
                <View
                  style={styles.tile}>
                  <Text
                    style={[
                      styles.title,
                      { fontWeight: collapseDetail ? "300" : "700" }
                    ]}>
                    Detail</Text>
                  {collapseDetail
                    ? <Entypo name="chevron-down" size={myFont.menuIconSize} color="#d2d4d7" />
                    : <Entypo name="chevron-up" size={myFont.menuIconSize} color="#d2d4d7" />}
                </View>
              </Pressable>
              <IssueInformation
                collapseDetail={collapseDetail}
                issue={issue} />
            </View>
          </ScrollView>
          <View style={styles.footer}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed
                    ? myFont.buttonPressedColor
                    : myFont.footerBackgroundColor
                },
                styles.backButton
              ]}
            >
              <Ionicons name="chevron-back" size={30} color={myFont.blue} />
            </Pressable>
            <View style={styles.footerGroupBtn}>
              <Button
                title="DELETE"
                onPress={() => Alert.alert(
                  "Are you sure you want to remove this item?",
                  "",
                  [
                    {
                      text: "Delete",
                      onPress: () => deleteItem()
                    },
                    {
                      text: "Cancel",
                      style: "cancel"
                    }
                  ]
                )}
                color="red" />
              <View style={{ marginHorizontal: 10 }}>
                <Button
                  title="EDIT"
                  onPress={() => {
                    navigation.push('EditIssueScreen', {
                      issue: issue,
                      project_id: issue.project.id,
                      parent_issue_list: parentIssueList,
                    })
                  }} />
              </View>
            </View>
          </View>
        </>
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: myFont.white,
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
  nameHeader: {
    width: "100%",
    backgroundColor: "#131924",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: myFont.itemBorderColor,
  },
  statusContainer: {
    width: 20,
    height: 74,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  groupRow: {
    width: "100%",
    height: 74,
    borderStyle: "solid",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: myFont.itemBorderColor,
    flexDirection: "row",
    backgroundColor: myFont.white,
  },
  halfCell: {
    width: "50%",
    height: 73,
    borderStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: myFont.itemBorderColor,
  },
  label: {
    paddingTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 2,
  },
  text: {
    fontSize: myFont.fontAddScreenSize,
    color: myFont.fontAddScreenColor,
    fontWeight: "300",
  },
  textDate: {
    paddingVertical: 1,
    paddingLeft: 10,
    paddingRight: 2,
  },
  tile: {
    width: "100%",
    height: 50,
    backgroundColor: "#ecedee",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 20,
  },
  backButton: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    backgroundColor: myFont.footerBackgroundColor,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 0,
    borderTopWidth: 1,
    borderColor: myFont.itemBorderColor,
  },
  footerGroupBtn: {
    alignItems: "center",
    flexDirection: "row",
  }
});
