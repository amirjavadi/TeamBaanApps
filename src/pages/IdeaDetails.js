import React from 'react';
import Header from '../components/Header';
import {Dimensions, Image, TextInput, TouchableOpacity, Platform} from 'react-native';
import {Container, Content, Text, View} from 'native-base';
import {DotIndicator} from 'react-native-indicators';
import axios from 'axios';
import api from './../api';
import moment from 'jalali-moment';
import {Actions} from 'react-native-router-flux';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

export default class IdeaDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      recordErrors: {},
      code: '',
      loader: false,
      item: {},
      res: false,
      listRow: [],
      noResult: false,
    }
  }

  async _setValue(value) {
    await this.setState({code: value, noResult: false})
  }

  async search() {
    this.setState({noResult: false});
    await axios.get(api.url + '/api/UIE2016/' + this.state.code + '/?$expand=Result')
      .then((response) => {
        this.setState({item: response.data, res: true, loader: false});
      })
      .catch((error) => this.setState({noResult: true, loader: false}));
    const result = this.state.item.result.map((item, index) =>
      <View key={index} style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#dcdcdc', borderStyle: 'dashed'}}>
        <Text style={{fontSize: 14, color: '#333333', fontFamily: 'Vazir-FD'}}>{item.item2}</Text>
        <Text style={{fontSize: 14, color: '#333333', fontFamily: 'Vazir-FD'}}>{moment(item.item1).locale('fa').format('jD jMMMM jYYYY | HH:mm')}</Text>
      </View>
    );
    this.setState({listRow: result})
  }

  render() {
    let {recordErrors} = this.state;
    return(
      <Container>
        <Header name="پیگیری وضعیت ثبت ایده"/>
        <View style={{position: 'absolute', width: deviceWidth * 2, height: deviceHeight / 4, backgroundColor: '#5c5c5c', marginLeft: -deviceWidth / 2, marginTop: -deviceHeight / 10, transform: [{rotate: '-12deg'}], elevation: 5, zIndex: 10}}>
          <View style={{width: deviceWidth * 2, height: deviceHeight / 4, backgroundColor: 'white', opacity: 0.2, marginLeft: -deviceWidth / 3, marginTop: -10, transform: [{rotate: '4deg'}]}}/>
          <Image source={require('./../pictures/rocket-white.png')} style={{position: 'absolute', zIndex: 4, bottom: 0, right: 0, width: deviceWidth / 8, height: deviceHeight / 9, resizeMode: 'contain', transform: [{rotate: '17deg'}], marginRight: deviceWidth / 2 - 10}}/>
        </View>
        <Content>
          <View style={{width: deviceWidth - 40, marginHorizontal: 20, marginTop: deviceHeight / 8, marginBottom: 30, direction: 'rtl', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start'}}>
            <View style={{width: deviceWidth - 40, flexDirection: 'column', padding: 0, marginTop: 10}}>
              <View Style={{flexDirection: 'column', justifyContent: 'center'}}>
                <Text style={{fontFamily: 'Vazir-FD', fontSize: 14, color: '#888888'}}>شماره پیگیری خود را وارد کنید :</Text>
                <Text style={{fontFamily: 'Vazir-FD', fontSize: 10, color: '#888888'}}>(زبان انگلیسی باشد.)</Text>
                <TextInput style={{width: deviceWidth - 40, borderBottomWidth: 1, borderBottomColor: recordErrors['userNameType'] ? 'red' : '#dcdcdc', padding: 5, textAlign: 'center', direction: 'rtl', fontFamily: 'Vazir-FD', color: '#333333', fontSize: 16}} onChangeText={(text) => this._setValue(text)}/>
              </View>
              <Text style={{display: recordErrors['userNameType'] ? 'flex' : 'none', fontSize: 10, color: 'red', fontFamily: 'Vazir-FD'}}>{recordErrors['userNameType']}</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7} style={{width: deviceWidth / 4, height: deviceHeight / 20, borderRadius: 5, backgroundColor: '#5c5c5c', alignItems: 'center', justifyContent: 'center', marginTop: 20, opacity: this.state.loader ? 0.2 : 1}} onPress={this.search.bind(this)} disabled={this.state.loader}>
              {!this.state.loader && <Text style={{fontSize: 14, color: 'white', ...Platform.select({
                  ios: {
                    fontFamily: 'Vazir-FD',
                    fontWeight: 'bold',
                    textAlign: 'center'
                  },
                  android: {
                    textAlign: 'center',
                    fontFamily: 'Vazir-Bold-FD',
                  }
                })}}>پیگیری</Text>}
              {this.state.loader && <DotIndicator size={5} color="white" count={5} />}
            </TouchableOpacity>
            {this.state.noResult && <Text style={{fontFamily: 'Vazir-FD', color: 'red', fontSize: 12, marginTop: 15}}>کد پیگیری نامعتبر است.</Text>}
            {this.state.res && <View style={{width: deviceWidth - 40, marginHorizontal: 20, marginTop: 20, flexDirection: 'column'}}>
              <View style={{width: deviceWidth - 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Text numberOfLines={1} style={{width: '75%', textAlign: 'left', fontSize: 15, color: '#333333', ...Platform.select({
                  ios: {
                    fontFamily: 'Vazir-FD',
                    fontWeight: 'bold',
                  },
                  android: {
                    fontFamily: 'Vazir-Bold-FD',
                  }
                  })}}>{this.state.item.titleIdea}</Text>
                <TouchableOpacity activeOpacity={0.7} style={{width: '18%', minWidth: 80, height: deviceHeight / 22, backgroundColor: 'green', borderRadius: 5, alignItems: 'center', justifyContent: 'center'}} onPress={() => Actions.editIdea({item: this.state.item})}>
                  <Text style={{fontSize: 14, color: 'white', fontFamily: 'Vazir-FD'}}>ویرایش ایده</Text>
                </TouchableOpacity>
              </View>
              <View style={{width: '100%', borderWidth: 1, borderColor: '#dcdcdc', alignItems: 'flex-start', marginTop: 15}}>
                <Text style={{fontSize: 14, color: '#666666', fontFamily: 'Vazir-FD', marginHorizontal: 10, marginVertical: 15}}>
                  {this.state.item.summaryIdeas}
                </Text>
              </View>
              <View style={{width: '100%', flexDirection: 'column', marginTop: 15}}>
                <View style={{width: '100%', padding: 5, borderBottomWidth: 1, borderBottomColor: '#dcdcdc', alignItems: 'center', justifyContent: 'center', backgroundColor: '#efefef'}}>
                  <Text style={{fontSize: 14, color: '#333333', fontFamily: 'Vazir-FD'}}>وضعیت ثبت ایده</Text>
                </View>
                {this.state.listRow}
              </View>
            </View>}
          </View>
        </Content>
      </Container>
    )
  }
}
