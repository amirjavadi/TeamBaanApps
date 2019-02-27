import React from 'react';
import {View, Dimensions, TouchableOpacity, Text, Image} from 'react-native';
import {Icon, Container, Content} from 'native-base';
import {Actions} from 'react-native-router-flux';
import communications from 'react-native-communications';
import axios from 'axios';
import api from './../api';
import ExpanableList from 'react-native-expandable-section-list';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

export default class Drawer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      childData: [],
    }
  }

  componentWillMount() {
    let noChild = [];
    let haveChild = [];
    axios.get(api.url + '/api/Menus/mainmenu')
      .then((response) => {
        for (let i =0; i < response.data.length; i++) {
          if (response.data[i].childerns === undefined) {
            noChild.push(response.data[i]);
            const item = noChild.map((item, index) =>
              <TouchableOpacity key={index} activeOpacity={0.7} style={{flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomColor: '#353535', borderBottomWidth: 0.5, paddingHorizontal: 10}} onPress={() => this.press1(item)}>
                <View style={{flexDirection: 'row'}}>
                  <Icon type="FontAwesome" name={item.style} style={{color: 'white', fontSize: 18}} />
                  <Text style={{fontSize: 14, color: 'white', fontFamily: 'Vazir-FD', marginHorizontal: 10}}>{item.title}</Text>
                </View>
              </TouchableOpacity>);
            this.setState({data: item});
          } else {
            haveChild.push(response.data[i]);
            this.setState({childData: haveChild});
          }
        }
      })
  }

  press1(item) {
    switch (item.itemId) {
      case '3' :
        if (Actions.currentScene === 'eventFather') {
          return true
        } else {
          return Actions.eventFather();
        }
      case '17' :
        if (Actions.currentScene === 'sponsers') {
          return true
        } else {
          return Actions.sponsers();
        }
      case '8' :
        if (Actions.currentScene === 'teachersFather') {
          return true
        } else {
          return Actions.teachersFather();
        }
      case '13' :
        if (Actions.currentScene === 'contact') {
          return true
        } else {
          return Actions.contact();
        }
      case '18' :
        if (Actions.currentScene === 'submitIdea') {
          return true
        } else {
          return Actions.submitIdea();
        }
    }
  }

  _renderSection(item, id) {
    return (
      <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomColor: '#353535', borderBottomWidth: 0.5, paddingHorizontal: 10}}>
        <View style={{flexDirection: 'row'}}>
          <Icon type="FontAwesome" name={this.icon(item)} style={{color: 'white', fontSize: 18}} />
          <Text style={{fontSize: 14, color: 'white', fontFamily: 'Vazir-FD', marginHorizontal: 10}}>{item}</Text>
        </View>
        <View>
          <Icon type="FontAwesome" name="angle-down" style={{fontSize: 16, color: 'white', marginRight: 5}}/>
        </View>
      </View>)
  }

  icon(item) {
    switch (item) {
      case 'صفحه اصلی':
        return 'home';
      case 'خانه':
        return 'home';
      case 'شتابدهنده':
        return 'rocket';
      case 'شتاب دهنده':
        return 'rocket';
    }
  }

  _renderRow(item, id, sId) {
    return (
      <TouchableOpacity activeOpacity={0.7} style={{flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, paddingLeft: 30, paddingRight: 20, borderBottomColor: '#353535', borderBottomWidth: 0.5}} onPress={() => this.press(item)}>
        <View style={{flexDirection: 'row'}}>
          <Icon type="FontAwesome" name={item.style} style={{color: 'white', fontSize: 16}} />
          <Text style={{fontSize: 12, color: 'white', fontFamily: 'Vazir-FD', marginHorizontal: 10}}>{item.title}</Text>
        </View>
      </TouchableOpacity>)
  }

  press(item) {
    switch (item.itemId) {
      case '2' :
        Actions.aboutSuperVisor();
        break;
      case '3' :
        Actions.aboutDesign();
        break;
      case '4' :
        Actions.goals();
        break;
      case '6' :
        Actions.educationFather();
        break;
      case '7' :
        Actions.workShops();
        break;
    }
  }

  render() {
    return (
      <Container style={{backgroundColor: '#464646'}}>
        <Content>
          <View style={{width: '100%', height: '100%', paddingVertical: 15}}>
            <ExpanableList
              dataSource={this.state.childData}
              headerKey="title"
              memberKey="childerns"
              renderSectionHeaderX={(section, sectionId)  => this._renderSection(section, sectionId)}
              renderRow={(rowItem, rowId, sectionId) => this._renderRow(rowItem, rowId, sectionId)}
            />
            {this.state.data}
            <TouchableOpacity activeOpacity={0.7} style={{flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomColor: '#353535', borderBottomWidth: 0.5, paddingHorizontal: 10}} onPress={() => Actions.IdeaDetails()}>
              <View style={{flexDirection: 'row'}}>
                <Icon type="FontAwesome" name="info" style={{color: 'white', fontSize: 18}} />
                <Text style={{fontSize: 14, color: 'white', fontFamily: 'Vazir-FD', marginHorizontal: 10}}>پیگیری ایده</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Content>
        <TouchableOpacity activeOpacity={0.7} style={{width: '100%', paddingVertical: 5, paddingHorizontal: 5, backgroundColor: '#333333', flexDirection: 'row', justifyContent: 'center'}} onPress={() => communications.web('http://dualp.ir/')}>
          <Image source={require('./../pictures/logo-black.png')} style={{width: deviceWidth * 30 / 100, height: (deviceHeight - 25) / 30, resizeMode: 'contain', opacity: 0.5}} />
        </TouchableOpacity>
      </Container>
    );
  }
}
