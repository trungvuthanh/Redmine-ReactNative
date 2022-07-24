import React, { useState } from 'react';
import {
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function ParentProjectPicker(props) {
  const [targetProject, setTargetProject] = useState(0)

  let projectList = props.projectList.map((project, index) => {
    return (
      <Picker.Item
        label={'#' + project.id + ' - ' + project.name}
        value={project.id}
        style={{ fontSize: 20 }}
        key={index} />
    );
  });
  projectList.splice(0, 0, <Picker.Item label='Select a project' value={0} style={{ fontSize: 20 }} key={0} />)

  return (
    <Picker
      selectedValue={targetProject}
      onValueChange={(itemValue, itemIndex) => {
        setTargetProject(itemValue);
        props.setSub(props.projectList.find(project => project.id === itemValue))
      }}
      style={styles.projectDropdownList}>
      {projectList}
    </Picker>
  );
}

const styles = StyleSheet.create({
  projectDropdownList: {
    height: 30,
    marginLeft: 2
  },
});
