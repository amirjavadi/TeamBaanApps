import React from 'react';
import {Body, Button, Icon, Left, Right, Text, View} from 'native-base';
import HeaderStyle from './../assets/style/Header';
import {Actions} from 'react-native-router-flux';

export default class Header extends React.Component {

  render() {
    return(
      <View style={HeaderStyle.main}>
        <Left>
          {this.props.name === 'شتاب دهنده مس سرچشمه رفسنجان' &&
          <Button transparent={true} onPress={() => Actions.drawerOpen()}>
            <Icon type="FontAwesome" name="bars" style={{color: '#555555', fontSize: 22}}/>
          </Button>}
          {this.props.name !== 'شتاب دهنده مس سرچشمه رفسنجان' &&
          <Button transparent={true} onPress={() => Actions.pop()}>
            <Icon name="arrow-forward" ios="ios-arrow-forward" android="md-arrow-forward" style={{color: '#333333', fontSize: 22}}/>
          </Button>}
        </Left>
        <Body>
          <Text numberOfLines={1} style={[HeaderStyle.title, {fontSize: this.props.name.length > 15 ? 10 : 14}]}>{this.props.name}</Text>
        </Body>
        <Right style={{top: 0}}>

        </Right>
      </View>
    )
  }
}
