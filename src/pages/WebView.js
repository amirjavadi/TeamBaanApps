import React from 'react';
import {WebView} from "react-native";
import {Container} from 'native-base';
import Header from '../components/Header';

export default class Web extends React.Component {

  render() {
    const URL = 'http://startup.dualp.ir/fa/Page/18#test';
    return(
      <Container>
        <Header name="ثبت ایده"/>
        <WebView
          source={{uri: URL}}
          startInLoadingState={true}/>
      </Container>
    )
  }
}
