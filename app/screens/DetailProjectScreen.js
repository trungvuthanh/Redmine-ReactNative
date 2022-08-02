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
  Alert,
  Button
} from 'react-native';
import { Ionicons, Entypo } from '@expo/vector-icons';

import { get_user } from '../api/user_api';
import {
  get_project,
  get_projects,
  get_issues_of_project,
  delete_project
} from '../api/project_api';
import {
  get_memberships,
  add_membership,
  delete_membership
} from '../api/membership_api';
import myFont from '../config/myFont';
import users from '../config/configurations';

import Phase from '../components/Phase';
import SubProject from '../components/SubProject';
import ProjectInformation from '../components/ProjectInformation';

export default function DetailProjectScreen({ route, navigation }) {
  let project = route.params.project;

  // user logged in app
  const [user, setUser] = useState(null);
  // members of this project
  const [members, setMembers] = useState([]);
  // user to be added/removed into this project
  let targetUser = 0;
  // role ids of user to be added into this project
  let roleIds = [];

  // Sub issues
  const [issues, setIssues] = useState([]);
  // Sub projects
  const [subProjectList, setSubProjectList] = useState([]);
  const [collapseSubProject, setcollapseSubProject] = useState(true);
  const [collapseIssue, setCollapseIssue] = useState(true);
  const [collapseDetail, setCollapseDetail] = useState(false);
  const [projectCount, setSubProjectCount] = useState(0);
  const [issueCount, setIssueCount] = useState(0);
  const [isLoading, setLoading] = useState(false);

  const syncUser = async () => {
    get_user()
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const syncProject = async () => {
    /*
    Get data of project
    */
    get_project(project.id)
      .then((data) => {
        project = data;
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const syncMemberships = async () => {
    /*
    Get memberships of this project
    */
    get_memberships(project.id)
      .then((data) => {
        setMembers(data.memberships);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  }

  const syncSubprojects = async () => {
    /*
    Get subprojects of this project
    */
    get_projects()
      .then((data) => {
        try {
          let subProjectList = [];
          let subProjectCount = 0;
          for (let prj of data.projects) {
            if (prj.parent != undefined && prj.parent.id == project.id) {
              subProjectCount += 1;
              subProjectList.push(prj)
            }
          }
          setSubProjectCount(subProjectCount);
          setSubProjectList(subProjectList);
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

  const syncIssuesOfProject = async () => {
    /*
    Get root issues of this project
    */
    get_issues_of_project(project.id)
      .then((data) => {
        try {
          let issueList = [];
          let issueCount = 0;
          for (let issue of data.issues) {
            if (issue.parent == undefined) {
              issueCount += 1;
              issueList.push(issue);
            }
          }
          setIssues(issueList);
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
    syncUser()
      // .then(syncProject())
      .then(syncSubprojects())
      .then(syncIssuesOfProject())
      .then(syncMemberships())
      .then(setRefreshing(false));
  }, []);

  useEffect(() => {
    syncUser()
      .then(syncSubprojects())
      .then(syncIssuesOfProject())
      .then(syncMemberships());
  }, []);

  const addSubProject = () => {
    navigation.push('AddProjectScreen', {
      projects: null,
      project_parent: {
        name: project.name,
        id: project.id
      }
    });
  }

  const addNewIssue = () => {
    navigation.push('AddIssueScreen', {
      project_id: project.id,
      parent_issue_list: issues,
      parent_issue: null
    });
  }

  const navigateToSubProject = (project) => {
    navigation.push('DetailProjectScreen', { project: project });
  }

  const navigateToSubIssue = (issue) => {
    navigation.push('DetailIssueScreen', { issue: issue });
  }

  const selectUser = (user) => {
    targetUser = user;
  }

  const selectRoles = (role_ids) => {
    roleIds = role_ids;
  }

  const addMemberToProject = async () => {
    let body = JSON.stringify({
      membership: {
        user_id: targetUser,
        role_ids: roleIds,
      }
    })
    if (targetUser == 0) {
      Alert.alert(
        "Specify a user to be added",
        "",
      );
    } else if (roleIds.length == 0) {
      Alert.alert(
        "Select roles to assign to new member",
        "",
      );
    } else {
      add_membership(project.id, body)
        .then((response) => {
          console.log(response.status);
          if (response.status == 201) {
            Alert.alert(
              "New member added",
              "",
              [{
                text: 'OK',
                style: 'cancel',
              }]
            );
          } else if (response.status == 422) {
            console.log(response)
            Alert.alert(
              "User has already been taken",
              "",
            );
          } else {
            Alert.alert(
              "Fail to add new member",
              "",
            );
          }
        })
        .then(onRefresh())
        .catch((error) => {
          console.error(error);
        })
        .finally(() => setLoading(false));
    }
  }

  const removeMemberOfProject = async () => {
    if (targetUser == 0) {
      Alert.alert(
        "Specify a user to be removed",
        "",
      );
    } else {
      let userToRemove = users.find(user => user.id == targetUser);
      let fullname = userToRemove.firstname.concat(' ', userToRemove.lastname).trim();
      get_memberships(project.id)
        .then((data) => {
          let membership_id;
          for (let membership of data.memberships) {
            if (membership.project.id == project.id && membership.user.id == targetUser) {
              membership_id = membership.id;
              break;
            }
          }
          delete_membership(membership_id)
            .then((response) => {
              console.log(response.status);
              if (response.status == 204) {
                Alert.alert(
                  fullname + " was removed from project",
                  "",
                  [{
                    text: 'OK',
                    style: 'cancel',
                  }]
                );
              } else if (response.status == 422) {
                console.log(response)
                Alert.alert(
                  "User has already been taken",
                  "",
                );
              } else {
                Alert.alert(
                  "Fail to add new member",
                  "",
                );
              }
            })
            .then(onRefresh())
            .catch((error) => {
              console.error(error);
            })
            .finally(() => setLoading(false));
        });
    }
  }

  const deleteItem = async () => {
    delete_project(project.id)
      .then((response) => {
        console.log(response.status);
        if (response.status == 204) {
          Alert.alert(
            "Project deleted successfully",
            "",
            [{
              text: 'OK',
              style: 'cancel',
              onPress: () => navigation.goBack(),
            }]
          );
        } else {
          Alert.alert(
            "Fail to delete project",
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
            <Text style={styles.textHeader}>Project</Text>
          </View>
          <ScrollView
            style={{ marginBottom: 50 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            <View style={styles.nameHeader}>
              <View
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  paddingRight: 5,
                  height: 74
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    color: myFont.white,
                    fontWeight: "700"
                  }}
                  ellipsizeMode="clip"
                >{project.name}</Text>
                <Text
                  style={{ fontSize: 16, color: myFont.white }}
                >#{project.id}</Text>
              </View>
            </View>
            <View style={styles.groupRow}>
              <View style={styles.halfCell}>
                <View style={styles.label}>
                  <Text style={styles.text}>CREATE:</Text>
                </View>
                <View style={styles.textDate}>
                  <Text style={{ fontSize: 20.8 }}>{project.created_on.substring(0, 10).split('-').reverse().join('/')}</Text>
                </View>
              </View>
              <View style={styles.halfCell}>
                <View style={styles.label}>
                  <Text style={styles.text}>UPDATE:</Text>
                </View>
                <View style={styles.textDate}>
                  <Text style={{ fontSize: 20.8 }}>{project.updated_on.substring(0, 10).split('-').reverse().join('/')}</Text>
                </View>
              </View>
            </View>
            <View style={{ borderColor: myFont.itemBorderColor, borderTopWidth: 1, borderBottomWidth: 1 }} >
              <Pressable
                onPress={() => setcollapseSubProject(!collapseSubProject)}>
                <View
                  style={styles.tile}>
                  <Text
                    style={[
                      styles.title,
                      { fontWeight: collapseSubProject ? "300" : "700" }]}>
                    Subprojects ({projectCount})</Text>
                  {collapseSubProject
                    ? <Entypo name="chevron-down" size={myFont.menuIconSize} color="#d2d4d7" />
                    : <Entypo name="chevron-up" size={myFont.menuIconSize} color="#d2d4d7" />}
                </View>
              </Pressable>
              <SubProject collapseSubProject={collapseSubProject} projects={subProjectList} addSubProject={addSubProject} navigateTo={navigateToSubProject} />
            </View>
            <View style={{ borderColor: myFont.itemBorderColor, borderTopWidth: 1, borderBottomWidth: 1 }} >
              <Pressable
                onPress={() => setCollapseIssue(!collapseIssue)}>
                <View
                  style={styles.tile}>
                  <Text
                    style={[
                      styles.title,
                      { fontWeight: collapseIssue ? "300" : "700" }]}>
                    Issues ({issueCount})</Text>
                  {collapseIssue
                    ? <Entypo name="chevron-down" size={myFont.menuIconSize} color="#d2d4d7" />
                    : <Entypo name="chevron-up" size={myFont.menuIconSize} color="#d2d4d7" />}
                </View>
              </Pressable>
              <Phase collapseIssue={collapseIssue} issues={issues} addNewIssue={addNewIssue} navigateToIssue={navigateToSubIssue} />
            </View>
            <View style={{ borderColor: myFont.itemBorderColor, borderTopWidth: 1, borderBottomWidth: 1 }} >
              <Pressable
                onPress={() => setCollapseDetail(!collapseDetail)}>
                <View
                  style={styles.tile}>
                  <Text
                    style={[
                      styles.title,
                      { fontWeight: collapseDetail ? "300" : "700" }]}>
                    Detail</Text>
                  {collapseDetail
                    ? <Entypo name="chevron-down" size={myFont.menuIconSize} color="#d2d4d7" />
                    : <Entypo name="chevron-up" size={myFont.menuIconSize} color="#d2d4d7" />}
                </View>
              </Pressable>
              <ProjectInformation
                collapseDetail={collapseDetail}
                project={project}
                members={members}
                selectUser={selectUser}
                selectRoles={selectRoles}
                saveTargetUser={addMemberToProject}
                saveUserToRemove={removeMemberOfProject}
                user={user} />
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
                    navigation.push('EditProjectScreen', {
                      project: project
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
