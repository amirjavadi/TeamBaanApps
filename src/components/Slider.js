import React from 'react';
import {Dimensions, FlatList, Image, View, Platform} from "react-native";
import axios from 'axios';
import api from '../api';
import {DotIndicator} from 'react-native-indicators';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

export default class Slider extends React.Component{

	constructor(props) {
		super(props);
		this.state = {
			interval: null,
			index: -1,
      data: [],
			ios: false,
			android: false,
		}
	}

  componentWillMount(){
    axios.get(api.url + '/api/ThemeSetting/file/slider?$select=Src')
      .then((response) => {
        if (response.data.length < 1) {
          this.setState({data: [{src: require('./../pictures/boil-logo.png')}]})
        } else if (response.data.length === 1) {
          let images = [];
          for (let i = 0; i < response.data.length; i++) {
            let obj = {
              src: response.data[i].src,
            };
            images.push(obj);
            this.setState({data: images});
          }
        } else {
          let images = [];
          for (let i = 0; i < response.data.length; i++) {
            let obj = {
              src: response.data[i].src,
            };
            images.push(obj);
            this.setState({data: images});
          }
          if (Platform.OS === 'ios'){
            this.setState({
              ios: true,
              android: false
            });
          }else {
            this.setState({
              ios: false,
              android: true
            });
          }
          this.initSlider();
        }
      });
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  initSlider() {
    this.setState({
      interval: setInterval(() => {
          this.scrollIndex()
      }, 2800)
    });
  }

  renderItem(item, index) {
    return(
      <View key={index} style={{width: deviceWidth, height: deviceHeight * 3 / 10}}>
        <Image style={{width: '100%', height: '100%', resizeMode: 'cover'}} source={{uri: item.src}}/>
      </View>
    )
  }

	scrollIndex = () => {
    let position = this.state.index + 1;
    position = position > 2 ? 0 : position;
    this.flatListRef.scrollToIndex({animated: true, index: position});
    this.setState({index: position});
  };

  _renderIndicators(data) {
    return (
      <View style={{alignItems: 'flex-start', justifyContent: 'flex-end', marginHorizontal: 5}}>
        <FlatList
          horizontal
          style={{position: 'absolute', zIndex: 500, paddingBottom: 5,}}
          renderItem={({item, index}) => this._renderActiveIndicator(item, index)}
          data={data}
          keyExtractor={(item, index) => index.toString()}
          ref={(ref) => { this.flatList = ref; }}
        />
      </View>
    );
  }

  _renderActiveIndicator(item, index) {
    if (this.state.index === index) {
      return (
        <View style={{width: 9, height: 9, marginHorizontal: 2, backgroundColor: 'rgba(63,209,196,1)', borderRadius: 2}}/>
      );
    } else {
      return (
        <View style={{width: 9, height: 9, marginHorizontal: 2, backgroundColor: 'rgba(63,209,196,0.4)', borderRadius: 2}}/>
      );
    }
  }

	render(){
		return(
			<View style={{height: deviceHeight*28/100, justifyContent: 'center'}}>
				<FlatList
					style={{height: deviceHeight*28/100}}
					data={this.state.data}
					horizontal={true}
					renderItem={({item}, index) => this.renderItem(item, index)}
					keyExtractor={(item, index) => index.toString()}
					scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
					ref={(ref) => { this.flatListRef = ref; }}
          ListEmptyComponent={<View style={{width: deviceWidth, height: deviceHeight * 28 / 100, alignItems: 'center', justifyContent: 'center'}}>
            <DotIndicator size={5} color="#148E91" count={5} style={{alignSelf: 'center', justifyContent: 'center'}}/>
          </View>}/>
        {this._renderIndicators(this.state.data)}
			</View>
		)
	}
}
