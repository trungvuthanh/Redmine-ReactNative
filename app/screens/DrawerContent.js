import React from 'react';
import { 
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItem
} from '@react-navigation/drawer';
import { 
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
  FontAwesome,
  Octicons,
} from '@expo/vector-icons';

import { AuthContext } from '../components/Context';
import myFont from '../config/myFont';
import { info } from '../info';
import { Drawer } from 'react-native-paper';

export default function DrawerContent(props) {
  const { signOut } = React.useContext(AuthContext);

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        <View style={styles.userInfoSection}>
          <Ionicons name="person-circle" size={50} color="white" />
          <Text style={styles.userInfoName}>Thanh Trung Admin</Text>
        </View>
        <Drawer.Section style={styles.drawerSection}>
          <Pressable
            onPress={() => props.navigation.navigate("Home")}
            style={styles.drawerItem}
          >
            <View style={styles.icon}>
              <MaterialCommunityIcons name="view-dashboard-outline" size={25} color="#898c91"/>
            </View>
            <Text style={styles.drawerItemText}>Dashboard</Text>
          </Pressable>
          <Pressable
            onPress={() => props.navigation.navigate("OpenProjectStack")}
            style={styles.drawerItem}
          >
            <View style={styles.icon}>
              <Ionicons name="briefcase-outline" size={25} color="#898c91"/>
            </View>
            <Text style={styles.drawerItemText}>Projects</Text>
          </Pressable>
          <Pressable
            onPress={() => props.navigation.navigate('IssueStack')}
            style={styles.drawerItem}
          >
            <View style={styles.icon}>
              <Octicons name="issue-opened" size={25} color="#898c91"/>
            </View>
            <Text style={styles.drawerItemText}>Issues</Text>
          </Pressable>
          <Pressable
            onPress={() => {}}
            style={styles.drawerItem}
          >
            <View style={styles.icon}>
              <Ionicons name="people-outline" size={25} color="#898c91"/>
            </View>
            <Text style={styles.drawerItemText}>Contact</Text>
          </Pressable>
          <Pressable
            onPress={() => {}}
            style={styles.drawerItem}
          >
            <View style={styles.icon}>
              <Ionicons name="calendar-outline" size={25} color="#898c91"/>
            </View>
            <Text style={styles.drawerItemText}>Agenda</Text>
          </Pressable>
          <Pressable
            onPress={() => {}}
            style={styles.drawerItem}
          >
            <View style={styles.icon}>
              <Ionicons name="time-outline" size={25} color="#898c91"/>
            </View>
            <Text style={styles.drawerItemText}>Worklogs</Text>
          </Pressable>
          <Pressable
            onPress={() => {}}
            style={styles.drawerItem}
          >
            <View style={styles.icon}>
              <Ionicons name="document-outline" size={25} color="#898c91"/>
            </View>
            <Text style={styles.drawerItemText}>Documents</Text>
          </Pressable>
          <Pressable
            onPress={() => {}}
            style={styles.drawerItem}
          >
            <View style={styles.icon}>
              <FontAwesome5 name="coins" size={24} color="#898c91"/>
            </View>
            <Text style={styles.drawerItemText}>Expenses</Text>
          </Pressable>
          <Pressable
            onPress={() => {}}
            style={styles.drawerItem}
          >
            <View style={styles.icon}>
              <FontAwesome name="envelope-o" size={24} color="#898c91"/>
            </View>
            <Text style={styles.drawerItemText}>Messages</Text>
          </Pressable>
        </Drawer.Section>
      </DrawerContentScrollView>
      <Drawer.Section>
        <Pressable
          onPress={() => {signOut()}}
          style={[
            styles.drawerItem,
            {
              borderTopWidth: 1,
              borderTopColor: "#ffffff66",
            }
          ]}
        >
          <View style={styles.icon}>
            <FontAwesome name="sign-out" size={24} color="#898c91"/>
          </View>
          <Text style={styles.drawerItemText}>Sign out</Text>
        </Pressable>
      </Drawer.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#131924",
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#131924",
    height: 45,
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#ffffff66",  
  },
  drawerItemText: {
    color: myFont.white,
    fontSize: myFont.fontDashboardSize,
    fontWeight: myFont.fontWeight,
  },
  drawerSection: {
    backgroundColor: "#131924",
  },
  icon: {
    width: 50,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  userInfoName: {
    color: myFont.white,
    fontSize: myFont.fontDashboardSize,
    fontWeight: myFont.fontWeight,
    marginLeft: 5,
  },
  userInfoSection: {
    height: 65,
    paddingLeft: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#131924",
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#ffffff66",
  },
})