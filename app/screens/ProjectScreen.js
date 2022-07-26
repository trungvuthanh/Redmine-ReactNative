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
  Button
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { get_projects } from '../api/project_api';
import myFont from '../config/myFont';

export default function ProjectScreen({ route, navigation }) {
  const [amount, setAmount] = useState(0)
  const [isLoading, setLoading] = useState(true);
  const [projectIdList, setProjectIdList] = useState([]);
  const [projectList, setProjectList] = useState([])

  // pull to refresh function
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    syncData()
      .then(setRefreshing(false));
  }, []);

  const syncData = async () => {
    get_projects()
      .then((data) => {
        /*
        Get list of project_id for creating a project
        */
        setProjectIdList(
          data.projects.map((project, index) => (
            project.parent
              ? { name: project.name, id: project.id, parent: project.parent }
              : { name: project.name, id: project.id }
          ))
        );
        let count = 0;

        /*
        Get root projects
        */
        setProjectList(
          data.projects.map((project, index) => {
            if (project.id != 1 && project.parent == undefined) {
              count += 1;
              return (
                <View style={styles.contentView} key={index}>
                  <Pressable
                    onPress={() => {
                      navigation.navigate("DetailProjectScreen", { project: project })
                    }}
                    style={({ pressed }) => [
                      styles.tile,
                      {
                        backgroundColor: pressed
                          ? myFont.buttonPressedColor
                          : myFont.white
                      }]}>
                    <View>
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: "700"
                        }}>
                        {project.name}</Text>
                      <Text>#{project.id}</Text>
                      <Text
                        style={{
                          fontSize: 16,
                          marginTop: 2
                        }}>
                        Created on: {project.created_on.substring(0, 10).split('-').reverse().join('/')}</Text>
                    </View>
                  </Pressable>
                </View>
              );
            }
          })
        );
        setAmount(count);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    syncData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? <ActivityIndicator /> :
        <>
          <View style={styles.header}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center"
              }}>
              <Pressable
                onPress={() => navigation.toggleDrawer()}
                style={styles.menuContainer}
              >
                <View>
                  <Ionicons name="ios-menu" size={myFont.menuIconSize} color="white" />
                </View>
              </Pressable>
              <Text style={styles.textHeader}>
                Projects
              </Text>
            </View>
            <View style={{ paddingRight: 15 }} >
              <Text
                style={{
                  fontSize: 18.6,
                  letterSpacing: myFont.letterSpace,
                  color: myFont.white
                }}>
                Total: {amount}</Text>
            </View>
          </View>
          <ScrollView
            style={{ marginBottom: 50 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {projectList}
          </ScrollView>
          <View style={styles.footer}>
            <Button
              title="NEW PROJECT"
              onPress={() => {
                navigation.push("AddProjectScreen", {
                  projects: projectIdList,
                  project_parent: null
                })
              }} />
          </View>
        </>
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecedee",
  },
  contentView: {
    alignItems: "center",
    backgroundColor: "#ecedee",
    padding: 7,
  },
  header: {
    width: "100%",
    height: 50,
    backgroundColor: myFont.darkColor,
    flexDirection: "row",
    justifyContent: "space-between",
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
    paddingVertical: 10,
    paddingLeft: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: myFont.itemBorderColor,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "flex-end",
    position: "absolute",
    bottom: 0,
    padding: 10,
  },
});
