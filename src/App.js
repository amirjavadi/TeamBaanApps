import React from 'react';
import {I18nManager, StyleSheet} from 'react-native';
import {Actions, Drawer, Router, Scene, Stack} from 'react-native-router-flux';
import {Icon} from 'native-base';
import RNRestart from 'react-native-restart';
I18nManager.forceRTL(true);

//components
import Splash from './components/Splash';
import Home from './pages/tabs/Home';
import Teachers from './pages/tabs/Teachers';
import Events from './pages/tabs/Events';
import Education from './pages/tabs/Education';
import Contact from './pages/tabs/Contact';
import Right from './components/Right';
import DrawerLayout from './components/DrawerLayout';
import AboutDesign from './pages/AboutDesign';
import AboutSuperVisor from './pages/AboutSuperVisor';
import WorkShops from './pages/WorkShops';
import Sponsers from './pages/Sponsers';
import EventDetails from './pages/EventDetails';
import WorkShopDetails from './pages/WorkShopDetails';
import TeacherDetails from './pages/TeacherDetails';
import EducationDetails from './pages/EducationDetails';
import SubmitIdea from './pages/SubmitIdea';
import IdeaDetails from './pages/IdeaDetails';
import EditIdea from './pages/EditIdea';
import SponsersDetails from './pages/SponsersDetails';
import Goals from './pages/Goals';



class TabIcon extends React.Component {
  render() {
    let color = this.props.focused ? '#13575f' : 'white';
    switch (this.props.iconName) {
      case 'home' :
        return <Icon type="FontAwesome" name="home" style={{color: color, fontSize: 30}}/>;
      case 'teachers' :
        return <Icon type="FontAwesome" name="users" style={{color: color, fontSize: 30}}/>;
      case 'events' :
        return <Icon type="FontAwesome" name="bullhorn" style={{color: color, fontSize: 30}}/>;
      case 'education' :
        return <Icon type="FontAwesome" name="graduation-cap" style={{color: color, fontSize: 30}}/>;
      case 'contact' :
        return <Icon type="FontAwesome" name="phone-square" style={{color: color, fontSize: 30}}/>;
    }
  }
}


export default class App extends React.Component {

  componentDidMount() {
    if (!I18nManager.isRTL) {
      RNRestart.Restart();
    }
  }

  onBackPress = () => {
    if (Actions.state.index === 0) {
      return false
    }
    Actions.pop();
    return true
  };

  render() {
    return (
      <Router backAndroidHandler={this.onBackPress}>
        <Scene key="root" hideNavBar direction="rightToLeft">
          <Drawer hideNavBar key="drawer" contentComponent={DrawerLayout} drawerPosition="right" >
            <Stack key="test" navBar={Right}>
              <Scene key="tabBar" tabs lazy={true} showLabel={false} tabBarStyle={style.tabBar} tabBarPosition="bottom" animationEnabled={false}>
                <Scene key='homeFather' hideNavBar icon={TabIcon} iconName="home" duration={0} initial>
                  <Scene key='home' hideNavBar component={Home} initial/>
                  <Scene key='submitIdea' hideNavBar component={SubmitIdea} />
                  <Scene key='sponsersDetails' hideNavBar component={SponsersDetails} />
                  <Scene key='IdeaDetails' hideNavBar component={IdeaDetails} />
                  <Scene key='editIdea' hideNavBar component={EditIdea} />
                  <Scene key="aboutDesign" hideNavBar component={AboutDesign} />
                  <Scene key="aboutSuperVisor" hideNavBar component={AboutSuperVisor} />
                  <Scene key="workShops" hideNavBar component={WorkShops} />
                  <Scene key="workShopDetails" hideNavBar component={WorkShopDetails} />
                  <Scene key="sponsers" hideNavBar component={Sponsers} />
                  <Scene key='eventDetails' hideNavBar component={EventDetails}/>
                  <Scene key='goals' hideNavBar component={Goals}/>
                </Scene>
                <Scene key='teachersFather' hideNavBar icon={TabIcon} iconName="teachers">
                  <Scene key='teachers' hideNavBar component={Teachers} initial />
                  <Scene key='teacherDetails' hideNavBar component={TeacherDetails} />
                </Scene>
                <Scene key='eventFather' hideNavBar icon={TabIcon} iconName="events">
                  <Scene key='events' hideNavBar component={Events} initial/>
                  <Scene key='eventDetails' hideNavBar component={EventDetails}/>
                </Scene>
                <Scene key="educationFather" hideNavBar icon={TabIcon} iconName="education">
                  <Scene key="education" hideNavBar component={Education} initial/>
                  <Scene key="educationDetails" hideNavBar component={EducationDetails}/>
                </Scene>
                <Scene key="contact" hideNavBar component={Contact} icon={TabIcon} iconName="contact"/>
              </Scene>
            </Stack>
          </Drawer>
          <Scene hideNavBar key="splash" component={Splash} initial/>
        </Scene>
      </Router>
    )
  }
}
const style = StyleSheet.create({
  tabBar: {
    display: 'flex',
    backgroundColor: '#00b5b8',
    elevation: 24,
    shadowOffset: {width: 5,  height: 10},
    shadowColor: 'black',
    shadowOpacity: 1,
  }
});

