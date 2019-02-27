import React from 'react';
import {Container, Icon, Text, Thumbnail, View} from 'native-base';
import Header from '../../components/Header';
import {Animated, Dimensions, FlatList, Image, Platform, TouchableOpacity} from 'react-native';
import axios from 'axios';
import api from '../../api';
import {Actions} from 'react-native-router-flux';
import DotIndicator from 'react-native-indicators/src/components/dot-indicator';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

export default class Education extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data: [],
      pageNumber: 1,
      loader: false,
      scrollY: new Animated.Value(0),
    }
  }

  componentWillMount() {
    this.getContents();
  }

  getContents() {
    axios.get(api.url + '/api/Categories/6/Contents/?page=' + this.state.pageNumber + '&pagesize=10&$expand=Files')
      .then((response) => {
        let data = [];
        if (response.data.length < 1) {
          let obj = {
            title: 'مطلب آموزشی وجود ندارد.',
            summery: '',
          };
          data.push(obj);
          this.setState({data: data});
        } else if (response.data.length >= 1) {
          if (response.data > 9) {
            this.setState({loader: true});
          }
          for (let i = 0; i < response.data.length; i++) {
            let txt = response.data[i].more;
            let text1 = txt.replace(/(<([^>]+)>)/ig, '');
            let text2 = text1.replace(/[&\/\\#,+()$~%'":*?<>{}]/g, '');
            let text3 = text2.replace(/[A-Za-z]/g, '');
            let text4 = text3.replace(/[;]/g, ' ');
            let obj = {
              title: response.data[i].title.replace(/(<([^>]+)>)/ig, ''),
              summery: response.data[i].summery.replace(/(<([^>]+)>)/ig, ''),
              more: text4,
              image: response.data[i].files[0].src_Thumbs,
            };
            data.push(obj);
          }
          this.setState(prevState => {
            return {
              data: [...prevState.data, ...data]
            }
          });
        }
      })
  }

  goToDetails(item) {
    if (Actions.currentScene === 'educationDetails'){
    } else {
      Actions.educationDetails({item: item})
    }
  }

  async handleLoadMore() {
    await this.setState({pageNumber: this.state.pageNumber + 1});
    this.getContents();
  }

  renderProducts(item) {
    return (
      <TouchableOpacity activeOpacity={0.7} style={{width: deviceWidth - 40, height: deviceHeight * 14 / 100, backgroundColor: 'rgba(254,113,0,0.2)', borderRadius: 3, marginBottom: 8, flexDirection: 'row', alignItems: 'center', padding: 5}} onPress={() => this.goToDetails(item)}>
        <Thumbnail square={true} source={{uri: item.image}} style={{width: deviceHeight * 14 / 100 -10, height: deviceHeight * 14 / 100 - 10, resizeMode: 'contain', borderRadius: 3}}/>
        <View style={{width: (deviceWidth - 50) - (deviceHeight * 14 / 100 - 20), height: '100%', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 7}}>
          <View style={{width: '100%', flexDirection: 'column'}}>
            <Text numberOfLines={1} style={{width: '85%', fontSize: 14, color: '#111111', fontFamily: 'Vazir-FD'}}>{item.title}</Text>
            <Text numberOfLines={1} style={{width: '75%', fontSize: 12, color: '#333333', fontFamily: 'Vazir-FD'}}>{item.summery}</Text>
          </View>
          <View style={{width: '100%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
            <Text style={{fontSize: 12, color: '#fe7100', fontFamily: 'Vazir-FD'}}>ادامه مطلب</Text>
            <Icon name="arrow-back" ios="ios-arrow-back" android="md-arrow-back" style={{color: '#fe7100', fontSize: 16, marginTop: 5, marginHorizontal: 5}}/>
          </View>
        </View>
      </TouchableOpacity>)
  }

  render() {
    const marginTop = this.state.scrollY.interpolate({
      inputRange: [0, deviceHeight / 4],
      outputRange: [deviceHeight / 10, -80],
      extrapolate: 'clamp',
    });
    return(
      <Container>
        <Header name="نکات آموزشی"/>
        <View style={{position: 'absolute', width: deviceWidth * 2, height: deviceHeight / 4, backgroundColor: '#33a6d0', marginLeft: -deviceWidth / 2, marginTop: -deviceHeight / 10, transform: [{rotate: '-12deg'}], elevation: 5, zIndex: 10}}>
          <View style={{width: deviceWidth * 2, height: deviceHeight / 4, backgroundColor: 'white', opacity: 0.2, marginLeft: -deviceWidth / 3, marginTop: -10, transform: [{rotate: '4deg'}]}}/>
          <Image source={require('./../../pictures/rocket-white.png')} style={{position: 'absolute', zIndex: 4, bottom: 0, right: 0, width: deviceWidth / 8, height: deviceHeight / 9, resizeMode: 'contain', transform: [{rotate: '17deg'}], marginRight: deviceWidth / 2 - 10}}/>
        </View>
        <View style={{width: deviceWidth - 40, marginHorizontal: 20, direction: 'rtl', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start'}}>
          <Animated.View style={{width: deviceWidth, position: 'absolute', flexDirection: 'row', marginTop, alignItems: 'flex-start', paddingHorizontal: 20}}>
            <Icon type="FontAwesome" name="bookmark" style={{color: '#33a6d0', fontSize: 20, marginHorizontal: 5}}/>
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
              }), color: '#333333', fontSize: 14}}>نکات آموزشی</Text>
          </Animated.View>
          <View style={{width: deviceWidth, direction: 'rtl', alignItems: 'center', justifyContent: 'center'}}>
            <FlatList
              style={{marginBottom: 50}}
              data={this.state.data}
              renderItem={({item}) => this.renderProducts(item)}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={<View style={{alignItems: 'center', justifyContent: 'center'}}>
                <DotIndicator size={5} color="#148E91" count={5} style={{alignSelf: 'center', marginTop: deviceHeight / 2 - 130}}/>
                <Text style={{fontSize: 10, color: '#333333', fontFamily: 'Vazir-FD', marginTop: 5}}>لطفا کمی صبر کنید...</Text>
              </View>}
              onEndReached={this.handleLoadMore.bind(this)}
              onEndReachedThreshold={0.1}
              ListFooterComponent={this.state.loader && <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <DotIndicator size={5} color="#148E91" count={5} style={{alignSelf: 'center', marginTop: deviceHeight / 2 - 130}}/>
              </View>}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{marginTop: deviceHeight / 10 + 40}}
              onScroll={Animated.event([{nativeEvent: {contentOffset: {y: this.state.scrollY}}}])}
            />
          </View>
        </View>
      </Container>
    )
  }
}
