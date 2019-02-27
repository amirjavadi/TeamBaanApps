import React from 'react';
import {Dimensions, FlatList, Image, View, TouchableOpacity} from "react-native";
import {DotIndicator} from 'react-native-indicators';
import axios from 'axios';
import api from '../api';
import {Actions} from 'react-native-router-flux';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

export default class Slider1 extends React.Component{

	constructor(props) {
		super(props);
		this.state = {
			data: [],
			hide: false,
		}
	}

	componentWillMount() {
	  let data = this.state.data;
    axios.get(api.url + '/api/Categories/4/Contents?$expand=Files')
      .then((response) => {
      	this.props.hide(false);
				for (let i = 0; i < response.data.length; i++) {
					let obj = {
						image: response.data[i].files[0].src_Thumbs,
            more: response.data[i].more,
					};
					data.push(obj);
				}
				this.setState({data});
      })
			.catch(() => this.props.hide(true))
  }

  check(item) {
    if (Actions.currentScene === 'sponsersDetails'){
    } else {
      Actions.sponsersDetails({item: item})
    }
  }

  renderItem(item, index) {
    return(
      <TouchableOpacity activeOpacity={0.7} onPress={() => this.check(item)}>
        <Image source={{uri: item.image}} style={{width: deviceWidth / 6, height: deviceHeight / 16, resizeMode: 'contain', marginHorizontal: this.state.data.length < 2 ? 0 : 10}}/>
      </TouchableOpacity>
    )
  }

	render(){
		return(
			<View style={{width: deviceWidth - 12, marginHorizontal: 6, height: this.state.hide ? 0 : deviceHeight / 12, justifyContent: 'center', marginTop: 6, backgroundColor: '#e5e3e4', paddingVertical: 5, alignItems: 'center'}}>
				<FlatList
					style={{height: deviceHeight / 12, paddingHorizontal: 10, direction: 'rtl'}}
					data={this.state.data}
					horizontal={true}
					renderItem={({item}, index) => this.renderItem(item, index)}
					keyExtractor={(item, index) => index.toString()}
					scrollEnabled={true}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={<View style={{width: deviceWidth, height: deviceHeight * 28 / 100, alignItems: 'center', justifyContent: 'center'}}>
            <DotIndicator size={5} color="#148E91" count={5} style={{alignSelf: 'center', justifyContent: 'center'}}/>
          </View>}/>
			</View>
		)
	}
}
