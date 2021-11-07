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

export default function ProjectInformation(props) {
  const project = props.project;
  
  return (
    <Collapsible 
      collapsed={props.showInfo}
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
              <Text style={styles.text}>identifier</Text>
            </View>
            <View style={styles.textDate}>
              <Text style={{fontSize: 20.8}}>{project.identifier}</Text>
            </View>
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
              <Text style={styles.text}>description</Text>
            </View>
            <View style={styles.textDate}>
              <Text style={{fontSize: 20.8}}>{project.description}</Text>
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
          }]}
        >
          <View style={styles.groupCell}>
            <View style={styles.label}>
              <Text style={styles.text}>subproject of</Text>
            </View>
            {
              project.parent ?
              <View style={styles.textDate}>
                <Text style={{fontSize: 20.8}}>
                  (#{project.parent.id}) {project.parent.name}
                </Text>
              </View>
              : <></>
            }
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
            <Text style={styles.text}>is public</Text>
          </View>
          <CheckBox
            disabled={true}
            value={project.is_public}
            style={{marginLeft: 4}}
          />
        </Pressable>
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
            <Text style={styles.text}>inherit members</Text>
          </View>
          <CheckBox
            disabled={true}
            value={project.inherit_members}
            style={{marginLeft: 4}}
          />
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
    textTransform: "uppercase"
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