import React from 'react';
import {Dimensions, Image, Platform} from 'react-native';
import {Container, Content, Icon, Text, View} from 'native-base';
import Header from '../../components/Header';
import {DotIndicator} from 'react-native-indicators';
import axios from 'axios';
import api from '../../api';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

export default class Contact extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      contact: '',
    }
  }

  componentDidMount() {
    axios.get(api.url + '/api/Content/13')
      .then((response) => {
        let about = response.data.more.replace(/(<([^>]+)>)/g, '');
        let newAbout = about.replace(/[&]nbsp[;]/gi, '');
        this.setState({contact: newAbout})
      })
  }

  render() {
    return(
      <Container>
        <Header name="راه های ارتباطی"/>
        <View style={{position: 'absolute', width: deviceWidth * 2, height: deviceHeight / 4, backgroundColor: '#5c5c5c', marginLeft: -deviceWidth / 2, marginTop: -deviceHeight / 10, transform: [{rotate: '-12deg'}], elevation: 5, zIndex: 10, direction: 'rtl'}}>
          <View style={{width: deviceWidth * 2, height: deviceHeight / 4, backgroundColor: 'white', direction: 'rtl', opacity: 0.2, marginLeft: -deviceWidth / 3, marginTop: -10, transform: [{rotate: '4deg'}]}}/>
          <Image source={require('./../../pictures/rocket-white.png')} style={{position: 'absolute', zIndex: 4, bottom: 0, right: 0, width: deviceWidth / 8, height: deviceHeight / 9, resizeMode: 'contain', transform: [{rotate: '17deg'}], marginRight: deviceWidth / 2 - 10}}/>
        </View>
        <Content>
          <View style={{width: deviceWidth - 40, marginHorizontal: 20, direction: 'rtl', paddingTop: deviceHeight / 10 + deviceHeight / 20, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
            <View style={{flexDirection: 'row', marginBottom: 10, direction: 'rtl'}}>
              <Icon type="FontAwesome" name="tags" style={{color: '#5c5c5c', fontSize: 20, marginHorizontal: 5}}/>
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
                }), color: '#333333', fontSize: 14}}>راه های ارتباطی</Text>
            </View>
            {this.state.contact === '' &&
            <View style={{width: deviceWidth, height: deviceHeight / 2, alignItems: 'center', justifyContent: 'center', direction: 'rtl'}}>
              <View style={{height: 20}}><DotIndicator size={5} color="#148E91" count={5}/></View>
              <Text style={{fontSize: 10, color: '#333333', fontFamily: 'Vazir-FD'}}>لطفا کمی صبر کنید...</Text>
            </View>}
            {this.state.contact !== '' &&
            <Text style={{fontFamily: 'Vazir-FD', direction: 'rtl', color: '#333333', fontSize: 14, textAlign: (Platform.OS === 'ios') ? 'justify' : 'left', lineHeight: 26, marginBottom: 10}}>
              {this.state.contact}
            </Text>}
          </View>
        </Content>
      </Container>
    )
  }
}
