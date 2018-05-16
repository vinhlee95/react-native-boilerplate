import React, { Component } from 'react';
import { View, Text, Animated, PanResponder, Dimensions, LayoutAnimation, UIManager } from 'react-native';
import { Card,Button } from 'react-native-elements';

const DEVICE_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESOLD = DEVICE_WIDTH * 0.25;
const SWIPEOUT_DURATION = 250;

class Deck extends Component {
   // default props to avoid errors when there is no
   // props passed in the root Component
   static defaultProps = {
      onSwipeRight: () => {},
      onSwipeRight: () => {}
   }
   state = { index: 0 }
   
   componentWillMount() {
      // animated system
      this.position = new Animated.ValueXY();
      
      // gesture system
      this.panResponder = PanResponder.create({
         // ask to be the responder
         onStartShouldSetPanResponder: () => true,
         onPanResponderMove: (event, gesture) => {
            this.position.setValue({ x: gesture.dx, y: gesture.dy });
         },
         onPanResponderRelease: (event, gesture) => {
            // when the card is swiped right
            if(gesture.dx > SWIPE_THRESOLD) {
               this.handleSwipe('right');
            } 
            // when the card is swiped left
               else if(gesture.dx < -SWIPE_THRESOLD) {
               this.handleSwipe('left');
            } else {
               Animated.spring(this.position, {
               toValue: {}
            }).start();
            }
         },
      });
   }

   componentWillReceiveProps(nextProps) {
      if(nextProps.data !== this.props.data) {
         this.setState({ index: 0 });
         LayoutAnimation.spring();         
      }
   }

   componentWillUpdate() {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
      LayoutAnimation.spring();
   }

   handleSwipe(direction) {
      const x = direction === 'right' ? DEVICE_WIDTH : -DEVICE_WIDTH;
      Animated.timing(this.position, {
         toValue: {
            x,
            y: 0
         },
         duration: SWIPEOUT_DURATION
      }).start(() => this.onSwipeComplete(direction));
   }

   onSwipeComplete(direction) {
      // const { onSwipeRight, onSwipeLeft, data } = this.props;
      // const item = data[this.state.index];

      // direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);
      this.position.setValue({ x: 0, y:0 });
      this.setState({ index: this.state.index + 1 });      
   }

   cardStyle() {
      const { position } = this;
      const rotate = position.x.interpolate({
         inputRange: [-DEVICE_WIDTH * 1.5, 0, DEVICE_WIDTH * 1.5],
         outputRange: ['-120deg', '0deg', '120deg'],
      });
      return {
         ...position.getLayout(),
         transform: [{ rotate }],
      }
   }

   renderCard = () => {
      return this.props.data.map(({id, text, uri}, cardIndex) => {
         if(cardIndex < this.state.index) { return null; }
         if(cardIndex === this.state.index) { 
            return (
               <Animated.View {...this.panResponder.panHandlers}
                  style={[this.cardStyle(), styles.cardStyle]} >
                  <Card
                     key={id}
                     image={{ uri }}
                     containerStyle={{ borderRadius: 5 }}>

                     <Text style={styles.title} >{text}</Text>
                     <Text style={{
                        marginBottom: 10
                     }}>Here is the description of the image</Text>

                     <Button 
                        title="View Now"
                        backgroundColor = '#03A9F4'
                        buttonStyle={{ borderRadius: '5px'}} />
                  </Card>
               </Animated.View>
            );
         }
         const marginTop = (cardIndex - this.state.index) * 10;
         return (
            // no gesture
            <Animated.View 
               style={[styles.cardStyle, {marginTop} ]}>
               <Card
                  key={id}
                  image={{ uri }}
                  containerStyle={{ borderRadius: 5 }}>

                  <Text style={styles.title} >{text}</Text>
                  <Text style={{
                     marginBottom: 10
                  }}>Here is the description of the image</Text>

                  <Button 
                     title="View Now"
                     backgroundColor = '#03A9F4'
                     buttonStyle={{ borderRadius: '5px'}} />
               </Card>
            </Animated.View>
         );
      }).reverse();
   }

   render() {
      let noCardMessage;
      if(this.state.index >= this.props.data.length) {
         noCardMessage = (
            <Card
               title="All Done!"
               containerStyle={{ borderRadius: 5 }}>
               <Text style={styles.noCardMessage}>Please load more cards</Text>
               <Button 
                  title="Load More"
                  backgroundColor = '#03A9F4'
                  buttonStyle={{ borderRadius: '5px'}}
                  onPress={() => this.props.handleLoadMoreCard()} />
            </Card>
         );
      }
      return(
         <View>
            {this.renderCard()}
            {noCardMessage}
         </View>
      )
   }
}

const styles = {
   titleStyle: {
      fontSize: 24,
      marginBottom: 10,
   },
   cardStyle: {
      position: 'absolute', 
      width: DEVICE_WIDTH,
   },
   noCardMessage: {
      textAlign: 'center',
      color: 'red',
      fontSize: 20,
      marginBottom: 20,
   }

}

export default Deck;