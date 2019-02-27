import React from 'react';
import Header from '../components/Header';
import {Container, Content, Icon, Text, View} from 'native-base';
import {Image, Dimensions, Platform} from 'react-native';
import axios from 'axios';
import api from '../api';
import DotIndicator from 'react-native-indicators/src/components/dot-indicator';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

export default class Sponsers extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      sponsers: '',
    }
  }

  componentDidMount() {
    axios.get(api.url + '/api/Content/17')
      .then((response) => {
        let about = response.data.more.replace(/[&\/\\#,+()=$~%'":*?<>{}]/g, '');
        let newAbout = about.replace(/[A-Za-z0-9]/g, '');
        let lastAbout = newAbout.replace(/[;]/g, ' ');
        this.setState({sponsers: lastAbout})
      })
  }

  render() {
    return(
      <Container>
        <Header name="صاحبان سرمایه"/>
        <View style={{position: 'absolute', width: deviceWidth * 2, height: deviceHeight / 4, backgroundColor: '#5b1bab', marginLeft: -deviceWidth / 2, marginTop: -deviceHeight / 10, transform: [{rotate: '-12deg'}], elevation: 5, zIndex: 10}}>
          <View style={{width: deviceWidth * 2, height: deviceHeight / 4, backgroundColor: 'white', opacity: 0.2, marginLeft: -deviceWidth / 3, marginTop: -10, transform: [{rotate: '4deg'}]}}/>
          <Image source={require('./../pictures/rocket-white.png')} style={{position: 'absolute', zIndex: 4, bottom: 0, right: 0, width: deviceWidth / 8, height: deviceHeight / 9, resizeMode: 'contain', transform: [{rotate: '17deg'}], marginRight: deviceWidth / 2 - 10}}/>
        </View>
        <Content>
          {this.state.sponsers === '' && <View style={{width: deviceWidth, height: deviceHeight - 135, alignItems: 'center', justifyContent: 'center'}}>
            <DotIndicator size={5} color="#148E91" count={5} style={{alignSelf: 'center', justifyContent: 'center'}}/>
          </View>}
          {this.state.sponsers !== '' && <View style={{width: deviceWidth - 40, marginHorizontal: 20, direction: 'rtl', paddingTop: deviceHeight / 10 + deviceHeight / 20, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
            <View style={{flexDirection: 'row', marginBottom: 10}}>
              <Icon type="FontAwesome" name="tags" style={{color: '#5b1bab', fontSize: 20, marginHorizontal: 5}}/>
              <Text style={{...Platform.select({
                  ios: {
                    fontFamily: 'Vazir-FD',
                    fontWeight: 'bold',
                    textAlign: 'center'
                  },
                  android: {
                    textAlign: 'center',
                    fontFamily: 'Vazir-Bold-FD',
                  }
                }), color: '#333333', fontSize: 14}}>صاحبان سرمایه</Text>
            </View>
            <Text style={{fontFamily: 'Vazir-FD', color: '#333333', fontSize: 14, textAlign: (Platform.OS === 'ios') ? 'justify' : 'left', lineHeight: 26, marginBottom: 10}}>
              {this.state.sponsers}
            </Text>
          </View>}
        </Content>
      </Container>
    )
  }
}
