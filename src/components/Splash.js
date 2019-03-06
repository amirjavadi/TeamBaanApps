import React,{Component} from 'react';
import {Animated, Dimensions, Easing, NetInfo, Platform, AsyncStorage} from 'react-native';
import {Container, View, Text, Button, Icon} from 'native-base';
import {Actions} from 'react-native-router-flux';
import DotIndicator from 'react-native-indicators/src/components/dot-indicator';
import axios from 'axios';
import api from '../api';
import version from './../version';
import BaseLightbox from './lightbox/BaseLightbox';
import Communications from 'react-native-communications';
import DeviceInfo from 'react-native-device-info';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

export default class Splash extends Component {

  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(0);
    this.animatedValue1 = new Animated.Value(0);
    this.animatedValue2 = new Animated.Value(0);
    this.animatedValue3 = new Animated.Value(0);
    this.animatedValue4 = new Animated.Value(0);
    this.animatedValue5 = new Animated.Value(0);
    this.state = {
      online: true,
      title: 'شتاب دهنده',
      interval: null,
      needUpdate: false,
      location: '',
      status: '',
    }
  }

  checkTitle() {
    axios.get(api.url + '/api/ThemeSetting/string/title')
      .then((response) => {
        this.setState({title: response.data})
      })
      .catch((error) => {
      })
  }

  async splash() {
    await AsyncStorage.getItem('firstTime').then((result) => {
      if (result === null) {
        this.setState({status: 'install'});
        AsyncStorage.setItem('firstTime', 'install');
      } else if (result === 'install') {
        this.setState({status: 'run'});
        AsyncStorage.setItem('firstTime', 'install');
      }
    });
  }

  componentDidMount() {
    this.setState({
      interval: setInterval(() => {
        this.checkTitle()
      }, 1000)
    });
    this.animate1();
    setTimeout(() => {
      this.animate();
    },300);
    setTimeout(() => {
      this.animate2();
      this.splash();
    },800);
    setTimeout(() => {
      this.animate3();
    },1000);
    setTimeout(() => {
      this.animate4();
      this.animate5();
      this.setLog();
      this.checkTitle();
    },1200);
    setTimeout(() => {
      this._checkNetwork();
    },1500);
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  async setLog() {
    let headers = {
      'Content-Type': 'application/json',
    };
    let systemVersion = DeviceInfo.getSystemVersion();
    let getManufacturer = DeviceInfo.getManufacturer();
    let getUniqueID = DeviceInfo.getUniqueID();
    let getModel = DeviceInfo.getModel();
    let getVersion = DeviceInfo.getVersion();
    let data = {
      appVersion: getVersion,
      Device: getModel,
      IMEI: getUniqueID,
      company: getManufacturer,
      osVersion: systemVersion,
      OS: Platform.OS,
      Status: this.state.status,
    };
    console.log(1, data);
    axios.post(api.url + '/api/log/addlog', JSON.stringify(data), {headers: headers})
      .then((response) => {
        //do nothing
      })
      .catch((error) => {console.info(error)})
  }

  async _checkNetwork() {
    await NetInfo.isConnected.fetch().then((isConnected) => {
      this.setState({online: isConnected}, () => {
        if (isConnected === true) {
          setTimeout(() => {
            this._checkVersion()
          },600);
        } else {
          this.setState({online: false})
        }
      });
    });
  }

  async _checkVersion() {
    await axios.get(api.url + '/api/ThemeSetting/string/versionApp')
      .then((response) => {
        if (response.data == null || response.data == undefined || response.data == '') {
          Actions.reset('drawer')
        } else {
          if (response.data != version.versionCode) {
            this.setState({needUpdate: true})
          } else {
            Actions.reset('drawer')
          }
        }
      })
      .catch((error) => Actions.reset('drawer'))
  }

  animate(){
    this.animatedValue.setValue(0);
    Animated.timing(this.animatedValue,{
      toValue: 1,
      duration: 300,
      easing : Easing.linear
    }).start()
  }
  animate1(){
    this.animatedValue1.setValue(0);
    Animated.timing(this.animatedValue1,{
      toValue: 1,
      duration: 300,
      easing : Easing.linear
    }).start()
  }
  animate2(){
    this.animatedValue2.setValue(0);
    Animated.timing(this.animatedValue2,{
      toValue: 1,
      duration: 500,
      easing : Easing.linear
    }).start()
  }
  animate3(){
    this.animatedValue3.setValue(0);
    Animated.timing(this.animatedValue3,{
      toValue: 1,
      duration: 500,
      easing : Easing.linear
    }).start()
  }
  animate4(){
    this.animatedValue4.setValue(0);
    Animated.timing(this.animatedValue4,{
      toValue: 1,
      duration: 500,
      easing : Easing.linear
    }).start()
  }
  animate5(){
    this.animatedValue5.setValue(0);
    Animated.timing(this.animatedValue5,{
      toValue: 1,
      duration: 500,
      easing : Easing.linear
    }).start(()=> this.animate5())
  }

  _refresh() {
    this.setState({online: true})
    this._checkNetwork();
  }

  renderLightBox() {
    if (this.state.needUpdate === true) {
      return (
        <BaseLightbox verticalPercent={0.8} horizontalPercent={0.26} close={false} backgroundColor={'rgba(52,52,52,0.6)'}>
          <View style={{width: '100%', height: '100%', flex: 1, padding: 15, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between'}}>
            <Icon type="MaterialCommunityIcons" name="refresh" style={{fontSize: 45, color: '#3fd1c4'}} />
            <Text style={{fontFamily: 'Vazir-FD', color: '#333333', fontSize: 14}}>لطفا نرم افزار را بروزرسانی بفرمایید</Text>
            <View style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
              <Button block transparent={true} style={{backgroundColor: '#3fd1c4', borderRadius: 5}}
                      onPress={() => Communications.web('http://teambaan.nicico.com/mediafolder/app/teambaan_1.apk')}>
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
                  }), color: 'white', fontSize: 14}}>لینک دانلود</Text>
              </Button>
            </View>
          </View>
        </BaseLightbox>)
    }
  }

  render() {
    const right = this.animatedValue1.interpolate({
      inputRange: [0, 1],
      outputRange: [0, deviceWidth * 3 / 7]
    });
    const rotate = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '20deg']
    });
    const opacity = this.animatedValue2.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    });
    const marginTop = this.animatedValue4.interpolate({
      inputRange:[0,1],
      outputRange:[130,0]
    });
    const marginLeft = this.animatedValue4.interpolate({
      inputRange:[0,1],
      outputRange:[130,0]
    });
    return(
      <Container>
        <View style={{flex: 1, width: deviceWidth, height: deviceHeight + 250, backgroundColor: 'white', justifyContent: 'flex-start', alignItems: 'center'}}>
          <Text style={{fontSize: deviceWidth < 450 ? 16 : 24, color: '#333333', marginTop: 20, borderBottomWidth: 1, borderBottomColor: '#aaaaaa', fontFamily: 'Vazir-FD'}}>{this.state.title}</Text>
          <Text style={{fontFamily: 'Vazir-Bold-FD', fontSize: 19, color: '#333333', marginTop: 14}}>اولین مرکز شتابدهنده توسعه</Text>
          <Text style={{fontFamily: 'Vazir-Bold-FD', fontSize: 16, color: '#333333', marginTop: 8}}>کسب و کار در رفسنجان</Text>
          <View style={{width: deviceWidth, alignItems: 'center', justifyContent: 'center', marginTop: 20}}>
            {this.state.online && <DotIndicator size={5} color="#148E91" count={5} style={{alignSelf: 'center', justifyContent: 'center'}}/>}
            {!this.state.online &&
            <View>
              <Text style={{fontFamily: 'Vazir-FD', fontSize: 14, textAlign: 'center', color: '#ad2726'}}>دسترسی به اینترنت ممکن نیست</Text>
              <Button transparent={true} style={{height: 30, borderWidth: 1, borderColor: '#ad2726', borderRadius: 5, display: 'flex', alignSelf: 'center', marginTop: 25}} onPress={() => this._refresh()}>
                <Text style={{fontFamily: 'Vazir-FD', fontSize: 12, color: '#ad2726', textAlign: 'center', height: 25}}>تلاش مجدد</Text>
              </Button>
            </View>}
          </View>
          <Animated.View style={{position: 'absolute', width: deviceWidth, height: deviceHeight * 2, backgroundColor: '#3fd1c4', right, transform: [{rotate}], zIndex: 2}}>
          <Animated.View style={{position: 'absolute', width: deviceWidth - 40, height: deviceHeight - 80, marginVertical: 40, marginHorizontal: 20, borderRightWidth: deviceWidth - 60, borderRightColor: 'rgba(255,255,255,0.15)', zIndex: 3, borderBottomWidth: deviceWidth - 80, borderBottomColor: 'transparent', opacity}}/>
          </Animated.View>
          <View style={{width: 200, height: 270, position: 'absolute', zIndex: 4, bottom: -120, right: -90}}>
            <Animated.Image source={require('./../pictures/rocket.png')} style={{width: 90, height: 120, resizeMode: 'contain', marginTop, marginLeft}}/>
            <Animated.Image source={require('./../pictures/fire1.png')} style={{width: 15, height: 25, resizeMode: 'contain', position: 'absolute', zIndex: 4, top: 107, left: 75, marginTop, marginLeft}}/>
            <Animated.Image source={require('./../pictures/fire2.png')} style={{width: 20, height: 30, resizeMode: 'contain', position: 'absolute', zIndex: 4, top: 112, left: 56, marginTop, marginLeft}}/>
            <Animated.Image source={require('./../pictures/fire3.png')} style={{width: 14, height: 20, resizeMode: 'contain', position: 'absolute', zIndex: 4, top: 120, left: 45, marginTop, marginLeft}}/>
          </View>
        </View>
        {this.renderLightBox()}
      </Container>
    )
  }
}
