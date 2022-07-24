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
import {
  get_issue,
  delete_issue
} from '../api/issue_api';
import myFont from '../config/myFont';
import users from '../config/configurations';

import Phase from '../components/Phase';
import SubPhase from '../components/SubPhase';
import SubProject from '../components/SubProject';
import IssueInformation from '../components/IssueInformation';
import ProjectInformation from '../components/ProjectInformation';

const WIDTH = Dimensions.get('window').width;

export default function DetailScreen({ route, navigation }) {
  const type = route.params.type;
  let project, issue;
  if (type === 'project') {
    project = route.params.project;
  } else if (type === 'issue') {
    issue = route.params.issue;
  }

  // user logged in app
  const [user, setUser] = useState(null);
  // members of this project
  const [members, setMembers] = useState([]);
  // user to be added/removed into this project
  let targetUser = 0;
  // role ids of user to be added into this project
  let roleIds = [];

  // Sub issues
  const [issues, setIssues] = useState({ issues: [] });
  const [allIssuesOfProject, setAllIssuesOfProject] = useState([]);
  // Sub projects
  const [projects, setProjects] = useState({ projects: [] });
  const [collapseSubproject, setCollapseSubproject] = useState(true);
  const [collapseIssue, setCollapseIssue] = useState(true);
  const [collapseDetail, setCollapseDetail] = useState(false);
  const [projectCount, setProjectCount] = useState(0);
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

  // type === 'project'
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

  // type === 'project'
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

  // type === 'project'
  const syncSubprojects = async () => {
    /*
    Get subprojects of this project
    */
    get_projects()
      .then((data) => {
        try {
          let projectList = [];
          let count = 0;
          for (let prj of data.projects) {
            if (prj.parent != undefined && prj.parent.id == project.id) {
              count += 1;
              projectList.push(prj)
            }
          }
          setProjectCount(count);
          setProjects({ projects: projectList });
        } catch (error) {
          setProjectCount(0);
          setProjects({ projects: [] });
          console.error(error);
          console.log('Server return no data')
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  }

  // type === 'project'
  const syncIssuesOfProject = async () => {
    /*
    Get root issues of this project
    */
    get_issues_of_project(project.id)
      .then((data) => {
        try {
          let count = 0;
          for (let iss of data.issues) {
            if (iss.parent == undefined) count += 1;
          }
          setIssues(data);
          setIssueCount(count);
        } catch (error) {
          setIssues({ issues: [] });
          setIssueCount(0);
          console.error(error);
          console.log('Server return no data')
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  }

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
          setAllIssuesOfProject(data.issues);
          let count = 0;
          let issueList = [];
          for (let iss of data.issues) {
            if (iss.parent != undefined && iss.parent.id == issue.id) {
              count += 1;
              issueList.push(iss);
            }
          }
          setIssues({ issues: issueList });
          setIssueCount(count);
        } catch (error) {
          setIssues({ issues: [] });
          setIssueCount(0);
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
    if (type === 'project') {
      syncUser()
        // .then(syncProject())
        .then(syncSubprojects())
        .then(syncIssuesOfProject())
        .then(syncMemberships())
        .then(setRefreshing(false));
    } else {
      syncUser()
        // .then(syncIssue())
        .then(syncIssuesOfIssue())
        .then(setRefreshing(false));
    }
  }, []);

  useEffect(() => {
    if (type === 'project') {
      syncUser()
        .then(syncSubprojects())
        .then(syncIssuesOfProject())
        .then(syncMemberships());
    } else {
      syncUser()
        .then(syncIssuesOfIssue());
    }
  }, []);

  const addSubProject = () => {
    navigation.push('AddScreen', {
      type: 'project',
      projects: projects.projects,
      parent: {
        name: project.name,
        id: project.id
      }
    });
  }

  const addNewIssue = () => {
    type === 'project'
      ? navigation.push('AddScreen', {
        type: 'issue',
        issues: issues.issues,
        parent_id: project.id
      })
      : navigation.push('AddScreen', {
        type: 'issue',
        issues: issues.issues,
        parent_id: issue.project.id, // id of project that contains parent issue
        parent_issue: issue
      });
  }

  const navigateToSubProject = (project) => {
    navigation.push('DetailScreen', {
      type: 'project',
      project: project
    });
  }

  const navigateToSubIssue = (issue) => {
    navigation.push('DetailScreen', {
      type: 'issue',
      issue: issue
    });
  }

  const selectUser = (user) => {
    targetUser = user;
  }

  const selectRoles = (role_ids) => {
    roleIds = role_ids;
  }

  const addMemberToProject = async () => {
    if (type === 'project') {
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
  }

  const removeMemberOfProject = async () => {
    if (type === 'project') {
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
  }

  const deleteItem = async () => {
    if (type === 'project') {
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
    } else {
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
            <Text style={styles.textHeader}>
              {
                type === 'project'
                  ? 'Project'
                  : 'Issue'
              }
            </Text>
          </View>
          <ScrollView
            style={{ marginBottom: 50 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            {type === 'project'
              ? <>
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
                    onPress={() => setCollapseSubproject(!collapseSubproject)}>
                    <View
                      style={styles.tile}>
                      <Text
                        style={[
                          styles.title,
                          { fontWeight: collapseSubproject ? "300" : "700" }]}>
                        Subprojects ({projectCount})</Text>
                      {collapseSubproject
                        ? <Entypo name="chevron-down" size={myFont.menuIconSize} color="#d2d4d7" />
                        : <Entypo name="chevron-up" size={myFont.menuIconSize} color="#d2d4d7" />}
                    </View>
                  </Pressable>
                  <SubProject collapseSubproject={collapseSubproject} projects={projects.projects} addSubProject={addSubProject} navigateTo={navigateToSubProject} />
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
                  <Phase collapseIssue={collapseIssue} issues={issues.issues} addNewIssue={addNewIssue} navigateToIssue={navigateToSubIssue} />
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
              </>
              : <>
                <View style={styles.nameHeader}>
                  <View
                    style={
                      [styles.statusContainer,
                      { backgroundColor: myFont.priorityColor[issue.priority.id - 1] }]} />
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
                  <SubPhase collapseIssue={collapseIssue} issues={issues.issues} addNewIssue={addNewIssue} navigateToIssue={navigateToSubIssue} />
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
                  <IssueInformation collapseDetail={collapseDetail} issue={issue} />
                </View>
              </>
            }
          </ScrollView>
          
        </>
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: myFont.blue,
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
  status: {
    width: 10,
    height: 50,
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
  groupCell: {
    width: "100%",
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
  statusTouch: {
    width: 25,
    height: 25,
    marginTop: 4,
    marginLeft: 10,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  title: {
    fontSize: 20,
  },
  editButton: {
    height: 50,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    backgroundColor: myFont.footerBackgroundColor,
    borderTopColor: myFont.footerBorderColor,
    width: "100%",
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 0,
  },
  footerGroupBtn: {
    alignItems: "center",
    flexDirection: "row",
    paddingRight: 10
  }
});
