import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class App extends React.Component {
   constructor(props) {
      super(props);
      this.state = { }
   }

  render() {
    return (
      <View style={styles.container}>
        <Text>My app</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    marginTop: 20,
  },
});
