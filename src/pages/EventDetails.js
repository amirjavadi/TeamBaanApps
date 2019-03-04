import React,{Component} from 'react';
import {Container, Content, Icon, Text, View} from 'native-base';
import Header from '../components/Header';
import {Image, Platform, Dimensions} from 'react-native';
import DotIndicator from 'react-native-indicators/src/components/dot-indicator';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

export default class EventDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      more: '',
    }
  }

  componentWillMount() {
    let txt = this.props.item.more;
    let text1 = txt.replace(/(<([^>]+)>)/ig, '');
    let text2 = text1.replace(/[&\/\\#,+()$~%'":*?<>{}]/g, '');
    let text3 = text2.replace(/[A-Za-z]/g, '');
    let text4 = text3.replace(/[;]/g, ' ');
    this.setState({more: text4})
  }

  render() {
    return(
      <Container>
        <Header name="رویدادها"/>
        <View style={{position: 'absolute', width: deviceWidth * 2, height: deviceHeight / 4, backgroundColor: '#8484fe', marginLeft: -deviceWidth / 2, marginTop: -deviceHeight / 10, transform: [{rotate: '-12deg'}], elevation: 5, zIndex: 10}}>
          <View style={{width: deviceWidth * 2, height: deviceHeight / 4, backgroundColor: 'white', opacity: 0.2, marginLeft: -deviceWidth / 3, marginTop: -10, transform: [{rotate: '4deg'}]}}/>
          <Image source={require('./../pictures/rocket-white.png')} style={{position: 'absolute', zIndex: 4, bottom: 0, right: 0, width: deviceWidth / 8, height: deviceHeight / 9, resizeMode: 'contain', transform: [{rotate: '17deg'}], marginRight: deviceWidth / 2 - 10}}/>
        </View>
        <Content>
          {this.props.item === '' && <View style={{width: deviceWidth, height: deviceHeight - 135, alignItems: 'center', justifyContent: 'center'}}>
            <DotIndicator size={5} color="#148E91" count={5} style={{alignSelf: 'center', justifyContent: 'center'}}/>
          </View>}
          {this.props.item !== '' && <View style={{width: deviceWidth - 40, marginHorizontal: 20, direction: 'rtl', paddingTop: deviceHeight / 10 + deviceHeight / 20, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
            <View style={{flexDirection: 'row', marginBottom: 10}}>
              <Icon type="FontAwesome" name="bookmark" style={{color: '#8484fe', fontSize: 20, marginHorizontal: 5}}/>
              <Text numberOfLines={2} style={{...Platform.select({
                  ios: {
                    fontFamily: 'Vazir-FD',
                    fontWeight: 'bold',
                    textAlign: 'center'
                  },
                  android: {
                    textAlign: 'center',
                    fontFamily: 'Vazir-Bold-FD',
                  }
                }), color: '#333333', fontSize: 14, width: '80%', textAlign: 'left'}}>{this.props.item.title}</Text>
            </View>
            <Text style={{flex: 1, fontFamily: 'Vazir-FD', color: '#333333', fontSize: 14, textAlign: (Platform.OS === 'ios') ? 'justify' : 'left', lineHeight: 26, marginBottom: 10, direction: 'rtl'}}>
              {this.props.item.more}
            </Text>
          </View>}
        </Content>
      </Container>
    )
  }
}
