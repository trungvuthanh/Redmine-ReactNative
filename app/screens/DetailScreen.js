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
  Alert
} from 'react-native';
import { Ionicons, Entypo } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from '@react-navigation/native';
// import Collapsible from 'react-native-collapsible';

import Phase from '../components/Phase';
import SubPhase from '../components/SubPhase';
import SubProject from '../components/SubProject';
import IssueInformation from '../components/IssueInformation';
import ProjectInformation from '../components/ProjectInformation';
import myFont from '../config/myFont';
import { localhost } from '../config/configurations';

const WIDTH = Dimensions.get('window').width;

export default function DetailScreen({ route, navigation }) {
  const type = route.params.type;
  let project, issue;
  if (type === 'project') {
    project = route.params.project;
  } else if (type === 'issue') {
    issue = route.params.issue;
  }

  const [user, setUser] = useState(null);

  // Sub issues
  const [issues, setIssues] = useState({issues: []});
  const [allIssuesOfProject, setAllIssuesOfProject] = useState([]);
  // Sub projects
  const [projects, setProjects] = useState({projects: []});
  const [showSub, setShowSub] = useState(true);
  const [showPhase, setShowPhase] = useState(true);
  const [showInfo, setshowInfo] = useState(true);
  const [projectCount, setProjectCount] = useState(0);
  const [issueCount, setIssueCount] = useState(0);
  const [isLoading, setLoading] = useState(false);

  const isFocused = useIsFocused();

  const getUserInfo = async () => {
    let user = await AsyncStorage.getItem('user');
    if (user) {
      let obj = JSON.parse(user);
      setUser(obj);
    }
  }

  // type === 'project'
  const getIssues = async () => {
    // Get subprojects of this project
    fetch(localhost + 'projects.json')
    .then((response) => response.json())
    .then((json) => {
      let projectList = [];
      let count = 0;
      for (let prj of json.projects) {
        if (prj.parent != undefined && prj.parent.id == project.id) {
          count += 1;
          projectList.push(prj)
        }
      }
      setProjectCount(count);
      setProjects({projects: projectList});
    })
    // Get issues of this project
    fetch(localhost + 'issues.json?project_id=' + project.id + '&status_id=*') 
    .then((response) => response.json())
    .then((json) => {
      let count = 0;
      for (let issue of json.issues) {
        if (issue.parent == undefined) count += 1;
      }
      setIssues(json);
      setIssueCount(count);
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
      getIssues().then(() => {
        setRefreshing(false);
      });
    } else {
      fetch(localhost + 'issues.json?project_id=' + issue.project.id + '&status_id=*')
      .then((response) => response.json())
      .then((json) => {
        // setIssues(json);
        let count = 0;
        let issueList = [];
        for (let iss of json.issues) {
          if (iss.parent != undefined && iss.parent.id == issue.id) {
            count += 1;
            issueList.push(iss);
          }
        }
        setIssues({issues: issueList});
        setIssueCount(count);
      })
      fetch(localhost + 'issues/' + issue.id + '.json')
      .then((response) => response.json())
      .then((json) => {
        issue = json.issue;
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setRefreshing(false));
    }
  }, []);

  useEffect(() => {
    getUserInfo();
    if (isFocused) {
      if (type === 'project') {
        getIssues();
      } else {
        fetch(localhost + 'issues.json?project_id=' + issue.project.id + '&status_id=*')
        .then((response) => response.json())
        .then((json) => {
          setAllIssuesOfProject(json.issues);
          let count = 0;
          let issueList = [];
          for (let iss of json.issues) {
            if (iss.parent != undefined && iss.parent.id == issue.id) {
              count += 1;
              issueList.push(iss);
            }
          }
          setIssues({issues: issueList});
          setIssueCount(count);
        })
        fetch(localhost + 'issues/' + issue.id + '.json')
        .then((response) => response.json())
        .then((json) => {
          issue = json.issue;
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => setLoading(false));
      }
    }
  }, [isFocused]);

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

  const addNewPhase = () => {
    type === 'project'
    ? navigation.push('AddScreen', { 
      type: 'issue', 
      issues: issues.issues, 
      parent_id: project.id
    })
    : navigation.push('AddScreen', { 
      type: 'issue', 
      issues: issues.issues,
      parent_id: issue.project.id,
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

  const deleteItem = async () => {
    if (type === 'project') {
      fetch(localhost + 'projects/' + project.id + '.json', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Redmine-API-Key': user.api_key,
        },
      })
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
      fetch(localhost + 'issues/' + issue.id + '.json', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Redmine-API-Key': user.api_key,
        },
      })
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
      {isLoading? <ActivityIndicator/> :
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
              {
                type === 'project'
                ? 'Project'
                : 'Issue'
              }
            </Text>
          </View>
          <ScrollView
            style={{marginBottom: 50}}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {type === 'project'
            ? <>
              <View style={styles.nameHeader}>
                <View style={styles.statusContainer}>
                  <View
                    style={[styles.status, {backgroundColor: myFont.statusColor[project.status - 1]}]}
                  />
                </View>
                <View
                  style={{alignItems: "flex-start", paddingVertical: 10, paddingRight: 5, width: WIDTH - 50}}
                >
                  <Text 
                    style={{
                      fontSize: 20, 
                      color: myFont.white,
                      fontWeight: myFont.fontWeight,  
                    }}
                    ellipsizeMode="clip"
                  >{project.name}</Text>
                  <Text
                    style={{fontSize: 16, color: "#898c91"}}
                  >(#{project.id})</Text>
                </View>
              </View>
              <View 
                style={[
                  styles.groupRow,
                  {flexDirection: "row"}
                ]}
              >
                <View style={styles.halfCell}>
                  <View style={styles.label}>
                    <Text style={styles.text}>create:</Text>
                  </View>
                  <View style={styles.textDate}>
                    <Text style={{fontSize: 20.8}}>{project.created_on.substring(0,10).split('-').reverse().join('/')}</Text>
                  </View>
                </View>
                <View style={styles.halfCell}>
                  <View style={styles.label}>
                    <Text style={styles.text}>update:</Text>
                  </View>
                  <View style={styles.textDate}>
                    <Text style={{fontSize: 20.8}}>{project.updated_on.substring(0,10).split('-').reverse().join('/')}</Text>
                  </View>
                </View>
              </View>
              <Pressable
                onPress={() => setShowSub(!showSub)}
              >
                <View
                  style={styles.tile}
                >
                  <Text style={[
                    styles.title,
                    {fontWeight: showSub ? "300" : "700"}
                  ]}
                  >Subprojects ({projectCount})</Text>
                  {showSub
                    ? <Entypo name="chevron-down" size={myFont.menuIconSize} color="#d2d4d7" />
                    : <Entypo name="chevron-up" size={myFont.menuIconSize} color="#d2d4d7" />
                  }
                </View>
              </Pressable>
              <SubProject showSub={showSub} projects={projects.projects} addSubProject={addSubProject} navigateTo={navigateToSubProject}/>
              <Pressable
                onPress={() => setShowPhase(!showPhase)}
              >
                <View
                  style={styles.tile}
                >
                  <Text style={[
                    styles.title,
                    {fontWeight: showPhase ? "300" : "700"}
                  ]}
                  >Issues ({issueCount})</Text>
                  {showPhase
                    ? <Entypo name="chevron-down" size={myFont.menuIconSize} color="#d2d4d7" />
                    : <Entypo name="chevron-up" size={myFont.menuIconSize} color="#d2d4d7" />
                  }
                </View>
              </Pressable>
              <Phase showPhase={showPhase} issues={issues.issues} addNewPhase={addNewPhase} navigateTo={navigateToSubIssue}/>
              <Pressable
                onPress={() => setshowInfo(!showInfo)}
              >
                <View
                  style={styles.tile}
                >
                  <Text style={[
                    styles.title,
                    {fontWeight: showInfo ? "300" : "700"}
                  ]}
                  >Detail</Text>
                  {showInfo
                    ? <Entypo name="chevron-down" size={myFont.menuIconSize} color="#d2d4d7" />
                    : <Entypo name="chevron-up" size={myFont.menuIconSize} color="#d2d4d7" />
                  }
                </View>
              </Pressable>
              <ProjectInformation showInfo={showInfo} project={project} />
            </>
            : <>
              <View style={styles.nameHeader}>
                <View style={styles.statusContainer}>
                  <View
                    style={[styles.status, {backgroundColor: myFont.statusColor[issue.status.id - 1]}]}
                  />
                </View>
                <View
                  style={{alignItems: "flex-start", paddingVertical: 10, paddingRight: 5, width: WIDTH - 50}}
                >
                  <Text 
                    style={{
                      fontSize: 20, 
                      color: myFont.white,
                      fontWeight: myFont.fontWeight,  
                    }}
                    ellipsizeMode="clip"
                  >{issue.subject}</Text>
                  <Text
                    style={{fontSize: 16, color: "#898c91"}}
                  >(#{issue.id})</Text>
                </View>
              </View>
              <View 
                style={[
                  styles.groupRow,
                  {flexDirection: "row"}
                ]}
              >
                <View style={[styles.halfCell, {minWidth: 150, width: "35%"}]}>
                  <View style={styles.label}>
                    <Text style={styles.text}>start date:</Text>
                  </View>
                  <View style={[styles.textDate, {alignSelf: "center"}]}>
                    <Text style={{fontSize: 20.8}}>{issue.start_date.substring(0,10).split('-').reverse().join('/')}</Text>
                  </View>
                </View>
                <View style={[styles.halfCell, {minWidth: 150, width: "35%"}]}>
                  <View style={styles.label}>
                    <Text style={styles.text}>due date:</Text>
                  </View>
                  <View style={[styles.textDate, {alignSelf: "center"}]}>
                    <Text style={{fontSize: 20.8}}>
                      {issue.due_date ? issue.due_date.substring(0,10).split('-').reverse().join('/') : ''}
                    </Text>
                  </View>
                </View>
                <View style={[styles.halfCell, {flex: 1}]}>
                  <View style={styles.label}>
                    <Text style={styles.text}>done</Text>
                  </View>
                  <View style={[styles.textDate, {alignSelf: "center"}]}>
                    <Text style={{fontSize: 20.8}}>{issue.done_ratio} %</Text>
                  </View>
                </View>
              </View>
              <Pressable
                onPress={() => setShowPhase(!showPhase)}
              >
                <View
                  style={styles.tile}
                >
                  <Text style={[
                    styles.title,
                    {fontWeight: showPhase ? "300" : "700"}
                  ]}
                  >Subtasks ({issueCount})</Text>
                  {showPhase
                    ? <Entypo name="chevron-down" size={myFont.menuIconSize} color="#d2d4d7" />
                    : <Entypo name="chevron-up" size={myFont.menuIconSize} color="#d2d4d7" />
                  }
                </View>
              </Pressable>
              <SubPhase showPhase={showPhase} issues={issues.issues} addNewPhase={addNewPhase} navigateTo={navigateToSubIssue}/>
              <Pressable
                onPress={() => setshowInfo(!showInfo)}
              >
                <View
                  style={styles.tile}
                >
                  <Text style={[
                    styles.title,
                    {fontWeight: showInfo ? "300" : "700"}
                  ]}
                  >Detail</Text>
                  {showInfo
                    ? <Entypo name="chevron-down" size={myFont.menuIconSize} color="#d2d4d7" />
                    : <Entypo name="chevron-up" size={myFont.menuIconSize} color="#d2d4d7" />
                  }
                </View>
              </Pressable>
              <IssueInformation showInfo={showInfo} issue={issue} />
            </>
            }
          </ScrollView>
          <View style={styles.footer}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={({pressed}) => [
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
              <Pressable
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
                style={({pressed}) => [
                  {
                    backgroundColor: pressed
                    ? myFont.deleteButtonColorPressed
                    : myFont.deleteButtonColor
                  },
                  styles.editButton
                ]}>
                <Text style={styles.editText}>delete</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  if (type === 'project') {
                    navigation.push('EditProjectScreen', {
                      project: project
                    })
                  } else {
                    navigation.push('EditIssueScreen', {
                      issue: issue,
                      issues: allIssuesOfProject
                    })  
                  }
                }}
                style={({pressed}) => [
                  {
                    backgroundColor: pressed
                    ? myFont.buttonPressedColor
                    : myFont.addButtonColor
                  },
                  styles.editButton
                ]}>
                <Text style={styles.editText}>edit</Text>
              </Pressable>
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
  nameHeader: {
    width: "100%",
		minHeight: 74,
		backgroundColor: "#131924",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  statusContainer: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  status: {
    width: 25,
    height: 25,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  groupRow: {
    width: "100%",
    height: 74,
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: myFont.itemBorderColor,
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
    textTransform: "uppercase"
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
  editText: {
    fontSize: 16,
    color: myFont.white,
    fontWeight: "700",
    textTransform: "uppercase",
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
    justifyContent: "space-between",
  }
})