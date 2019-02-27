import React from 'react';
import HeaderStyle from '../assets/style/Header';
import {Image, View} from 'react-native';
import axios from 'axios';
import api from '../api';

export default class Right extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      logo: '',
    }
  }

  async componentDidMount() {
    await axios.get(api.url + '/api/ThemeSetting/file/logo?$select=Src')
      .then((response) => {
        let src = response.data[0].src;
        this.setState({logo: src});
      })
  }

  render() {
    return(
      <View style={{height: 50, position: 'absolute', backgroundColor: 'transparent', top: 0, right: 5, flexDirection: 'row', justifyContent: 'flex-end'}}>
        <Image source={{uri: this.state.logo}} style={HeaderStyle.logo}/>
      </View>
    )
  }
}
