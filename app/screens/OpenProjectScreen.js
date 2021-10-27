import React, { useState, useEffect } from 'react';
import { 
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AddScreen from './AddScreen';
import DetailScreen from './DetailScreen';
import Header from "../components/Header";
import ItemTiles from "../components/ItemTiles";
import myFont from '../config/myFont';
import Footer from "../components/Footer";

export default function OpenProjectScreen({ route, navigation }) {
  const [isLoading, setLoading] = useState(true);
  // const [projects, setProjects] = useState([]);
  const [mylist, setMylist] = useState([]);
  const [openProjectAmount, setOpenProjectAmount] = useState(0);

  // const getInformation = () => {
  //   return new Promise((resolve, reject) => {
  //     fetch("http://192.168.137.1:80/redmine/projects.json")
  //       .then((response) => response.json())
  //       .then((json) => {
  //         // setProjects(json["projects"]);
  //         setMylist([]);
  //         setMylist(
  //           json["projects"].map((project, index) =>
  //             <ItemTiles
  //               key={index}
  //               name={project.name}
  //               id={project.id}
  //               date={project.created_on.substring(0,10).split('-').reverse().join('-')}
  //               status={project.status}
  //             />
  //           )
  //         );
  //         resolve();
  //       })
  //       .catch((error) => {
  //         reject(error);
  //       });
  //   });
  // };
  
  useEffect(() => {
    fetch("http://192.168.1.50:80/redmine/projects.json")
      .then((response) => response.json())
      .then((json) => {
        // setProjects(json["projects"]);
        setOpenProjectAmount(json["total_count"]);
        setMylist([]);
        setMylist(
          json["projects"].map((project, index) =>
            <View key={index}>
              <Pressable
                onPress={() => navigation.push("DetailScreen", {project})}
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
                  date={project.created_on.substring(0,10).split('-').reverse().join('-')}
                  status={project.status - 1}
                />
              </Pressable>
            </View>
          )
        );
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
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
              <Text style={{fontSize: 18.6, letterSpacing: myFont.letterSpace}}> ({openProjectAmount}/{openProjectAmount})</Text>
            </Text>
          </View>
          {/* <Header title="Open projects" amount={route.params.amount} /> */}
          <ScrollView>
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
              onPress={() => navigation.push("AddScreen")}
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
});