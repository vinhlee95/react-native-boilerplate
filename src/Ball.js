import React, { Component } from 'react';
import { View, Animated } from 'react-native';

class Ball extends Component {
   componentWillMount() {
      // current position
      this.position = new Animated.ValueXY(0,0);
      Animated.spring(this.position, {
         toValue: { x:0, y: 500}
      }).start();
   }

   render() {
      return(
         <Animated.View style={this.position.getLayout()} >
            <View style={styles.ballStyle} />
         </Animated.View>
      );
   }
}

const styles = {
   ballStyle: {
      width: 50, 
      height: 50,
      borderRadius: '50%',
      borderWidth: 25,
      borderColor: 'lightgrey'
   }
}

export default Ball;