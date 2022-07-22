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

import ItemTiles from "../components/ItemTiles";

export default function ProjectScreen({ route, navigation }) {
  const [amount, setAmount] = useState(0)
  const [isLoading, setLoading] = useState(true);
  const [projectList, setProjectIdList] = useState([]);
  const [mylist, setMylist] = useState([])

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
              ? {name: project.name, id: project.id, parent: project.parent}
              : {name: project.name, id: project.id}
            ))
          );
          let count = 0;

          /*
          Get root projects
          */
          setMylist(
            data.projects.map((project, index) => {
              if (project.id != 1 && project.parent == undefined) {
                count += 1;
                return (
                  <View key={index}>
                    <Pressable
                      onPress={() => navigation.navigate("DetailScreen", { type: 'project' , project: project })}
                      style={({pressed}) => 
                        [{
                          backgroundColor: pressed
                            ? myFont.buttonPressedColor
                            : myFont.white
                        }]
                      }
                    >
                      <ItemTiles
                        name={project.name}
                        id={project.id}
                        date={project.created_on.substring(0,10).split('-').reverse().join('/')}
                        status={project.status - 1}
                      />
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
              Projects
              <Text style={{fontSize: 18.6, letterSpacing: myFont.letterSpace}}> ({amount})</Text>
            </Text>
          </View>
          <ScrollView 
            style={{marginBottom: 50}}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {mylist}
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
            <Button
              title="NEW PROJECT"
              onPress={() => navigation.push("AddScreen", { projects: projectList, type: 'project' })}/>
          </View>
        </>
      }
    </SafeAreaView>
	);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
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
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: myFont.addButtonColor,
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
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    paddingRight: 10,
  },
});