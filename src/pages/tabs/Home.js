import React from 'react';
import {StatusBar, Dimensions, TouchableOpacity, Platform} from 'react-native';
import {Container, Content, View, Icon, Text, Button} from 'native-base';
import Header from '../../components/Header';
import Slider from '../../components/Slider';
import Slider1 from '../../components/Slider1';
import Slider2 from '../../components/Slider2';
import {Actions} from 'react-native-router-flux';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

export default class Home extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      hide: false,
    }
  }

  getHideValue = (value) => {
    this.setState({hide: value})
  };

  check(name) {
    switch (name) {
      case 'aboutDesign' :
        return Actions.currentScene === 'aboutDesign' ? {} : Actions.aboutDesign();
      case 'events' :
        return Actions.currentScene === 'eventFather' ? {} : Actions.eventFather();
      case 'aboutSuperVisor' :
        return Actions.currentScene === 'aboutSuperVisor' ? {} : Actions.aboutSuperVisor();
      case 'workShops' :
        return Actions.currentScene === 'workShops' ? {} : Actions.workShops();
      case 'submitIdea' :
        return Actions.currentScene === 'submitIdea' ? {} : Actions.submitIdea();
    }
  }

  render() {
    return(
      <Container>
        <Header name="شتاب دهنده مس سرچشمه رفسنجان"/>
        <StatusBar
          backgroundColor="#00b5b8"
          barStyle="light-content" />
        <Content>
          <Slider/>
          <Slider1 />
          <View style={{width: deviceWidth, paddingHorizontal: 6, flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
            <View style={{flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
              <TouchableOpacity activeOpacity={1} style={{backgroundColor: '#f7bd42', width: deviceWidth / 2 - 10, height: deviceWidth / 2 - 70, marginBottom: -0.5, alignItems: 'center', justifyContent: 'center'}} onPress={() => this.check('aboutDesign')}>
                <Icon type="FontAwesome" name="tags" style={{color: 'white', fontSize: deviceWidth > 760 ? 60 : 50}}/>
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
                  }), color: 'white', fontSize: 16}}>درباره طرح</Text>
              </TouchableOpacity>
              <View style={{width: 0, height: 0, borderBottomWidth: 15, borderTopWidth: 15, borderTopColor: '#f7bd42', borderBottomColor: 'transparent', borderLeftColor: '#f7bd42', borderLeftWidth: deviceWidth / 4 - 5, borderRightWidth: deviceWidth / 4 - 5, borderRightColor: 'transparent'}}/>
              <View style={{width: 0, height: 0, marginTop: -23, zIndex: 2, borderTopColor: 'transparent', borderRightColor: '#8484fe', borderLeftColor: 'transparent', borderBottomColor: '#8484fe', borderRightWidth: deviceWidth / 4 - 5, borderLeftWidth: deviceWidth / 4 - 5, borderTopWidth: 15, borderBottomWidth: 15, }}/>
              <TouchableOpacity activeOpacity={1} style={{backgroundColor: '#8484fe', width: deviceWidth / 2 - 10, height: deviceWidth / 2 - 70, marginTop: -0.5, alignItems: 'center', justifyContent: 'center'}} onPress={() => this.check('events')}>
                <Icon type="FontAwesome" name="bullhorn" style={{color: 'white', fontSize: deviceWidth > 760 ? 60 : 50}}/>
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
                  }), color: 'white', fontSize: 16}}>رویدادها</Text>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
              <TouchableOpacity activeOpacity={1} style={{backgroundColor: '#5dd243', width: deviceWidth / 2 - 10, height: deviceWidth / 2 - 40, marginBottom: -0.5, alignItems: 'center', justifyContent: 'center'}} onPress={() => this.check('aboutSuperVisor')}>
                <Icon type="FontAwesome" name="tag" style={{color: 'white', fontSize: deviceWidth > 760 ? 60 : 50}}/>
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
                  }), color: 'white', fontSize: 16}}>درباره پشتیبان</Text>
              </TouchableOpacity>
              <View style={{width: 0, height: 0, borderBottomColor: 'transparent', borderLeftColor: 'transparent', borderRightColor: '#5dd243', borderTopColor: '#5dd243', borderBottomWidth: 15, borderTopWidth: 15, borderRightWidth: deviceWidth / 4 - 5, borderLeftWidth: deviceWidth / 4 - 5}}/>
              <View style={{width: 0, height: 0, marginTop: -23, zIndex: 2, borderTopColor: 'transparent', borderLeftColor: '#e66bae', borderBottomColor: '#e66bae', borderRightColor: 'transparent', borderTopWidth: 15, borderBottomWidth: 15, borderLeftWidth: deviceWidth / 4 - 5, borderRightWidth: deviceWidth / 4 - 5}}/>
              <TouchableOpacity activeOpacity={1} style={{backgroundColor: '#e66bae', width: deviceWidth / 2 - 10, height: deviceWidth / 2 - 100, marginTop: -0.5, alignItems: 'center', justifyContent: 'center'}} onPress={() => this.check('workShops')}>
                <Icon type="FontAwesome" name="briefcase" style={{color: 'white', fontSize: deviceWidth > 760 ? 60 : 50}}/>
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
                  }), color: 'white', fontSize: 16}}>کارگاه ها</Text>
              </TouchableOpacity>
            </View>
          </View>
          {!this.state.hide && <Slider2 hide={this.getHideValue}/>}
          <TouchableOpacity activeOpacity={0.7} style={{width: deviceWidth - 12, height: deviceHeight / 12, flexDirection: 'row', backgroundColor: '#0072bb', marginTop: 6, marginHorizontal: 6, borderRadius: 0, alignItems: 'center', justifyContent: 'center'}} onPress={() =>this.check('submitIdea')}>
            <Icon type="FontAwesome" name="bolt" style={{fontSize: 24, color: 'white', paddingRight: 0, paddingLeft: 0, marginRight: 5, marginLeft: 5}}/>
            <Text style={{fontSize: 18, color: 'white', ...Platform.select({
                ios: {
                  fontFamily: 'Vazir-FD',
                  fontWeight: 'bold',
                  textAlign: 'center'
                },
                android: {
                  textAlign: 'center',
                  fontFamily: 'Vazir-Bold-FD',
                }
              }), paddingRight: 0, paddingLeft: 0}}>ثبت ایده</Text>
          </TouchableOpacity>
        </Content>
      </Container>
    )
  }
}
