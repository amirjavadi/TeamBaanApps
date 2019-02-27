import React from 'react';
import Header from '../components/Header';
import {Container, Content, Icon, Text, View} from 'native-base';
import {Dimensions, Image, Platform} from 'react-native';
import axios from 'axios';
import api from '../api';
import DotIndicator from 'react-native-indicators/src/components/dot-indicator';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

export default class AboutDesign extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      aboutDesign: '',
    }
  }

  componentDidMount() {
    axios.get(api.url + '/api/Content/3')
      .then((response) => {
        let about = response.data.more.replace(/[&\/\\#,+()=$~%'":*?<>{}]/g, '');
        let newAbout = about.replace(/[A-Za-z0-9]/g, '');
        let lastAbout = newAbout.replace(/[;]/g, ' ');
        this.setState({aboutDesign: lastAbout})
      })
  }

  render() {
    return(
      <Container>
        <Header name="درباره طرح"/>
        <View style={{position: 'absolute', width: deviceWidth * 2, height: deviceHeight / 4, backgroundColor: '#f7bd42', marginLeft: -deviceWidth / 2, marginTop: -deviceHeight / 10, transform: [{rotate: '-12deg'}], elevation: 5, zIndex: 10}}>
          <View style={{width: deviceWidth * 2, height: deviceHeight / 4, backgroundColor: 'white', opacity: 0.2, marginLeft: -deviceWidth / 3, marginTop: -10, transform: [{rotate: '4deg'}]}}/>
          <Image source={require('./../pictures/rocket-white.png')} style={{position: 'absolute', zIndex: 4, bottom: 0, right: 0, width: deviceWidth / 8, height: deviceHeight / 9, resizeMode: 'contain', transform: [{rotate: '17deg'}], marginRight: deviceWidth / 2 - 10}}/>
        </View>
        <Content>
          {this.state.aboutDesign === '' &&
          <View style={{width: deviceWidth, height: deviceHeight - 135, alignItems: 'center', justifyContent: 'center'}}>
            <View style={{height: 20}}><DotIndicator size={5} color="#148E91" count={5}/></View>
            <Text style={{fontSize: 10, color: '#333333', fontFamily: 'Vazir-FD'}}>لطفا کمی صبر کنید...</Text>
          </View>}
          {this.state.aboutDesign !== '' && <View style={{width: deviceWidth - 40, marginHorizontal: 20, direction: 'rtl', paddingTop: deviceHeight / 10 + deviceHeight / 20, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
            <View style={{flexDirection: 'row', marginBottom: 10}}>
              <Icon type="FontAwesome" name="tags" style={{color: '#f7bd42', fontSize: 20, marginHorizontal: 5}}/>
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
                }), color: '#333333', fontSize: 14}}>درباره طرح</Text>
            </View>
            <Text style={{fontFamily: 'Vazir-FD', color: '#333333', fontSize: 14, textAlign: (Platform.OS === 'ios') ? 'justify' : 'left', lineHeight: 26, marginBottom: 10}}>
              {this.state.aboutDesign}
            </Text>
          </View>}
        </Content>
      </Container>
    )
  }
}
