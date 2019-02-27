import React from 'react';
import {Dimensions, FlatList, View, Platform, TouchableOpacity} from "react-native";
import {Button, Icon, Text} from "native-base";
import {DotIndicator} from 'react-native-indicators';
import axios from 'axios';
import api from './../api';
import {Actions} from 'react-native-router-flux';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

export default class Slider1 extends React.Component{

	constructor(props) {
		super(props);
    this.handleViewableItemsChanged = this.handleViewableItemsChanged.bind(this);
    this.viewabilityConfig = {viewAreaCoveragePercentThreshold: 50};
		this.state = {
			interval: null,
			index: -1,
			data: [],
			ios: false,
			android: false,
      onePost: undefined,
		}
	}

    componentWillMount() {
      axios.get(api.url + '/api/Categories/3/Contents/?page=1&pagesize=5')
        .then((response) => {
          let data = [];
          if (response.data.length < 1) {
            let obj = {
              title: 'امروز خبری موجود نیست.',
              summery: '',
            };
            data.push(obj);
            this.setState({data: data});
          } else if (response.data.length === 1) {
            this.setState({onePost: true});
            let txt = response.data[0].more.replace(/(<([^>]+)>)/ig, '');
            let obj = {
              title: response.data[0].title.replace(/(<([^>]+)>)/ig, ''),
              summery: response.data[0].summery.replace(/(<([^>]+)>)/ig, ''),
              more: txt.replace(/[&]nbsp[;]/gi, '')
            };
            data.push(obj);
            this.setState({data: data});
          } else if (response.data.length > 1) {
            this.setState({onePost: false});
            for (let i = 0; i < response.data.length; i++) {
              let txt = response.data[i].more.replace(/(<([^>]+)>)/ig, '');
              let obj = {
                title: response.data[i].title.replace(/(<([^>]+)>)/ig, ''),
                summery: response.data[i].summery.replace(/(<([^>]+)>)/ig, ''),
                more: txt.replace(/[&]nbsp[;]/gi, '')
              };
              data.push(obj);
            }
            this.setState({data: data});
            if (Platform.OS === 'ios'){
              this.setState({
                ios: true,
                android: false
              });
            } else {
              this.setState({
                ios: false,
                android: true
              });
            }
            this.initSlider();
          }
        })
    }

    componentWillUnmount() {
      clearInterval(this.state.interval);
		}

    initSlider() {
			this.setState({
				interval: setInterval(() => {
						this.scrollIndex()
				}, 4000)
			});
    }

  handleViewableItemsChanged(info) {
    clearInterval(this.state.interval);
  }

  goToNew(item) {
    if (Actions.currentScene === 'eventDetails'){

    } else {
      Actions.eventDetails({item: item})
    }
  }

  renderItem(item, index) {
    return(
      <TouchableOpacity activeOpacity={0.7} key={index} style={{width: deviceWidth, height: deviceHeight / 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: this.state.onePost === true ? 15 : 40}} onPress={() => this.goToNew(item)}>
        <Icon type="FontAwesome" name="bullhorn" style={{fontSize: 24, color: '#555555', backgroundColor: '#bbbbbb', padding: 6, borderRadius: 4}}/>
        <View style={{width: deviceWidth - 90, height: '100%', flexDirection: 'column', justifyContent: 'center', textAlign: 'right', direction: 'rtl', marginLeft: 5}}>
          <Text numberOfLines={1} style={{width: this.state.onePost === true ? '100%' : '85%', fontSize: 12, color: '#333333', fontFamily: 'Vazir-FD'}}>{item.title}</Text>
          <Text numberOfLines={1} style={{width: this.state.onePost === true ? '100%' : '75%', fontSize: 10, color: '#aaaaaa', fontFamily: 'Vazir-FD'}}>{item.summery}</Text>
        </View>
      </TouchableOpacity>
    )
  }

	scrollIndex = () => {
        let position = this.state.index + 1;
        position = position > 2 ? 0 : position;
        this.flatListRef.scrollToIndex({animated: true, index: position});
        this.setState({index: position});
    };

    nSlide() {
        clearInterval(this.state.interval);
        let position = this.state.index;
        if (position === -1) {
            this.flatListRef.scrollToIndex({animated: true, index: 0});
            this.setState({index: 0}, () => this.initSlider());
            return;
		}
        position += 1;
        if (position === 3) {
            this.flatListRef.scrollToIndex({animated: true, index: 0});
            this.setState({index: 0}, () => this.initSlider());
            return;
		}
        this.flatListRef.scrollToIndex({animated: true, index: position});
        this.setState({index: position}, () => this.initSlider());
    }

	pSlide() {
        clearInterval(this.state.interval);
        let position = this.state.index;
        if (position === -1) {
            this.flatListRef.scrollToIndex({animated: true, index: 1});
            this.setState({index: 1}, () => this.initSlider());
            return;
        }
        position -= 1;
        if (position === -1) {
            this.flatListRef.scrollToIndex({animated: true, index: 2});
            this.setState({index: 2}, () => this.initSlider());
            return;
        }
        this.flatListRef.scrollToIndex({animated: true, index: position});
        this.setState({index: position}, () => this.initSlider());
    }

	render(){
		return(
			<View style={{height: deviceHeight / 12, justifyContent: 'center', marginTop: 10}}>
				<FlatList
          pagingEnabled={true}
          onViewableItemsChanged={this.handleViewableItemsChanged}
          viewabilityConfig={this.viewabilityConfig}
					style={{height: deviceHeight / 12}}
					data={this.state.data}
					horizontal={true}
					renderItem={({item}, index) => this.renderItem(item, index)}
					keyExtractor={(item, index) => index.toString()}
					scrollEnabled={true}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={<View style={{width: deviceWidth, height: deviceHeight * 28 / 100, alignItems: 'center', justifyContent: 'center'}}>
            <DotIndicator size={5} color="#148E91" count={5} style={{alignSelf: 'center', justifyContent: 'center'}}/>
          </View>}
					ref={(ref) => { this.flatListRef = ref; }}/>
				{this.state.ios && <View style={{position: 'absolute', width: '100%', justifyContent: 'space-between', flexDirection: 'row'}}>
					<Button small transparent style={{justifyContent: 'flex-start', alignItems: 'center'}}>
						<Icon onPress={this.nSlide.bind(this)} type="FontAwesome" name="angle-right" style={{fontSize: 24, color: 'black', opacity: 0.4}}/>
					</Button>
					<Button small transparent style={{justifyContent: 'flex-end', alignItems: 'center'}}>
						<Icon onPress={this.pSlide.bind(this)} type="FontAwesome" name="angle-left" style={{fontSize: 24, color: 'black', opacity: 0.4}}/>
					</Button>
				</View>}
				{this.state.android && <View style={{position: 'absolute', width: '100%', justifyContent: 'space-between', flexDirection: 'row'}}>
					<Button small transparent style={{justifyContent: 'flex-start', alignItems: 'center'}}>
						<Icon onPress={this.pSlide.bind(this)} type="FontAwesome" name="angle-right" style={{fontSize: 24, color: 'black', opacity: 0.4}}/>
					</Button>
					<Button small transparent style={{justifyContent: 'flex-end', alignItems: 'center'}}>
						<Icon onPress={this.nSlide.bind(this)} type="FontAwesome" name="angle-left" style={{fontSize: 24, color: 'black', opacity: 0.4}}/>
					</Button>
				</View>}
			</View>
		)
	}
}
