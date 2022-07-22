import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import CheckBox from '@react-native-community/checkbox';

import myFont from '../config/myFont';

export default function IssueInformation(props) {
  const issue = props.issue;
  
  return (
    <Collapsible 
      collapsed={props.collapseDetail}
    >
      <View style={styles.groupRow}>
        <Pressable
          style={({pressed}) => 
          [{
            backgroundColor: pressed
              ? myFont.buttonPressedColor
              : myFont.white
          }]
        }
        >
          <View style={styles.groupCell}>
            <View style={styles.label}>
              <Text style={styles.text}>PROJECT</Text>
            </View>
            <View style={styles.textDate}>
              <Text style={{fontSize: 20.8}}>#{issue.project.id} - {issue.project.name}</Text>
            </View>
          </View>
        </Pressable>
      </View>
      <View
        style={[
          styles.groupRow,
          {flexDirection: "row"}
        ]}
      >
        <Pressable
          style={({pressed}) => [
            styles.halfCell,
            {
              backgroundColor: pressed
                ? myFont.buttonPressedColor
                : myFont.white,
              position: "relative",
            }
          ]}
        >
          <View style={styles.label}>
            <Text style={styles.text}>TRACKER</Text>
          </View>
          <View style={styles.textDate}>
            <Text style={{fontSize: 20.8}}>{issue.tracker.name}</Text>
          </View>
        </Pressable>
        <Pressable
          style={({pressed}) => [
            styles.halfCell,
            {
              backgroundColor: pressed
                ? myFont.buttonPressedColor
                : myFont.white,
              position: "relative",
            }
          ]}
        >
          <View style={styles.label}>
            <Text style={styles.text}>PRIORITY *</Text>
          </View>
          <View style={styles.textDate}>
            <Text style={{fontSize: 20.8}}>{issue.priority.name}</Text>
          </View>
        </Pressable>
      </View>
      <View
        style={[
          styles.groupRow,
          {flexDirection: "row"}
        ]}
      >
        <Pressable
          style={({pressed}) => [
            styles.halfCell,
            {
              backgroundColor: pressed
                ? myFont.buttonPressedColor
                : myFont.white
            },
          ]}
        >
          <View style={styles.label}>
            <Text style={styles.text}>ESTIMATED TIME (H)</Text>
          </View>
          <View style={styles.textDate}>
            <Text style={{fontSize: 20.8}}>{issue.estimated_hours}</Text>
          </View>
        </Pressable>
        <Pressable
          style={({pressed}) => [
            styles.halfCell,
            {
              backgroundColor: pressed
                ? myFont.buttonPressedColor
                : myFont.white,
              position: "relative",
            }
          ]}
        >
          <View style={styles.label}>
            <Text style={styles.text}>STATUS</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View
              style={[styles.statusTouch, {backgroundColor: myFont.statusColor[issue.status.id - 1]}]}
            />
            <Text style={{fontSize: 20.8}}>{issue.status.name}</Text>
          </View>
        </Pressable>
      </View>
      <View style={[styles.groupRow, {height: 138}]}>
        <Pressable
          style={({pressed}) => [
            {
              backgroundColor: pressed
                ? myFont.buttonPressedColor
                : myFont.white
            }
          ]}
        >
          <View style={[styles.groupCell, {height: 137}]}>
            <View style={styles.label}>
              <Text style={styles.text}>DESCRIPTION</Text>
            </View>
            <View style={styles.textDate}>
              <Text style={{fontSize: 20.8}}>{issue.description}</Text>
            </View>
          </View>
        </Pressable>
      </View>
      <View style={styles.groupRow}>
        <Pressable
          style={({pressed}) => 
          [{
            backgroundColor: pressed
              ? myFont.buttonPressedColor
              : myFont.white
          }]
        }
        >
          <View style={styles.groupCell}>
            <View style={styles.label}>
              <Text style={styles.text}>ASSIGNED TO</Text>
            </View>
            <View style={styles.textDate}>
              <Text style={{fontSize: 20.8}}>{issue.assigned_to ? issue.assigned_to.name.trim() : ''}</Text>
            </View>
          </View>
        </Pressable>
      </View>
      <View
        style={[
          styles.groupRow,
          {flexDirection: "row"}
        ]}
      >
        <Pressable
          style={({pressed}) => [
            styles.halfCell,
            {
              backgroundColor: pressed
                ? myFont.buttonPressedColor
                : myFont.white
            }
          ]}
        >
          <View style={styles.label}>
            <Text style={styles.text}>PRIVATE</Text>
          </View>
          <CheckBox
            disabled={true}
            value={issue.is_private}
            style={{marginLeft: 4}}
          />
        </Pressable>
        <Pressable
          style={({pressed}) => [
            styles.halfCell,
            {
              backgroundColor: pressed
                ? myFont.buttonPressedColor
                : myFont.white,
              position: "relative",
            }
          ]}
        >
          <View style={styles.label}>
            <Text style={styles.text}>CREATED BY</Text>
          </View>
          <View style={styles.textDate}>
            <Text style={{fontSize: 20.8}}>{issue.author.name.trim()}</Text>
          </View>
        </Pressable>
      </View>
    </Collapsible>    
  );
}

const styles = StyleSheet.create({
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
  },
  textDate: {
    paddingVertical: 1,
    paddingLeft: 10,
    paddingRight: 2,
  },
  statusTouch: {
    width: 25,
    height: 25,
    marginTop: 4,
    marginHorizontal: 10,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
})