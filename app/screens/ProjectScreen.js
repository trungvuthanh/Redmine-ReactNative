import React, { useState, useEffect } from 'react';
import { 
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AddScreen from './AddScreen';
import DetailScreen from './DetailScreen';
import Header from "../components/Header";
import ItemTiles from "../components/ItemTiles";
import myFont from '../config/myFont';
import Footer from "../components/Footer";
import { localhost } from '../config/configurations';

export default function ProjectScreen({ route, navigation }) {
  const [amount, setAmount] = useState(0)
  const [isLoading, setLoading] = useState(true);
  const [projectList, setProjectIdList] = useState([]);
  const [mylist, setMylist] = useState([])

  // pull to refresh function
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getInfo().then(() => {
      setRefreshing(false);
    });
  }, []);

  const getInfo = async () => {
    fetch(localhost + 'projects.json')
    .then((response) => response.json())
    .then((json) => {
      setProjectIdList(
        json["projects"].map((project, index) => (
          project.parent
          ? {name: project.name, id: project.id, parent: project.parent}
          : {name: project.name, id: project.id}
        ))
      );
      let count = 0;
      setMylist(
        json["projects"].map((project, index) => {
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
    getInfo();
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
              Open projects
              <Text style={{fontSize: 18.6, letterSpacing: myFont.letterSpace}}> ({amount})</Text>
            </Text>
          </View>
          {/* <Header title="Open projects" amount={route.params.amount} /> */}
          <ScrollView 
            style={{marginBottom: 50}}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {mylist}
          </ScrollView>
          {/* <Footer/> */}
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
            <Pressable
              onPress={() => navigation.push("AddScreen", { projects: projectList, type: 'project' })}
              style={({pressed}) => [
                {
                  backgroundColor: pressed
                    ? myFont.buttonPressedColor
                    : myFont.addButtonColor
                },
                styles.backButton
              ]}
            >
              <Ionicons name="add" size={40} color={myFont.white} />
            </Pressable>
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
    position: "absolute",
    bottom: 0,
  },
});