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

import Header from "../components/Header";
import myFont from '../config/myFont';
import Footer from "../components/Footer";

export default function MyIssueScreen({ route, navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [myIssueAmount, setMyIssueAmount] = useState(0);
  const [myIssues, setMyIssues] = useState([]);
  
  const getIssues = async () => {
    fetch('http://192.168.1.50:80/redmine/issues.json?assigned_to_id=1&status_id=*')
    .then((response) => response.json())
    .then((json) => {
      setMyIssues(json.issues);
      setMyIssueAmount(json.total_count);
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => setLoading(false));
  }

  useEffect(() => {
    getIssues();
  }, []);

  const myIssueList = myIssues.map((issue, index) => {
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
  });

  // pull to refresh function
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getIssues()
    .then(() => {
      setRefreshing(false);
    });
  }, []);
  
	return (
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
              My Issues
              <Text style={{fontSize: 18.6, letterSpacing: myFont.letterSpace}}> ({myIssueAmount})</Text>
            </Text>
          </View>
          {/* <Header title="My ToDo" amount={myIssueAmount} /> */}
          <ScrollView 
            style={{marginBottom: 50}}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {myIssueList}
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
  backButton: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    height: 50,
    paddingHorizontal: 15,
    backgroundColor: myFont.addButtonColor,
  },
  statusContainer: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  status: {
    width: 25,
    height: 25,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
});