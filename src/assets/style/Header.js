import {Platform, StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

let HeaderStyle;
export default HeaderStyle = StyleSheet.create({
  main: {
    width: deviceWidth,
    height: 50,
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    elevation: 10,
    shadowOffset:{  width: 0,  height: 10,  },
    shadowColor: 'black',
    alignItems: 'center',
    shadowOpacity: 0.4,
    zIndex: 100,
    borderBottomWidth: 1,
    borderBottomColor: '#dcdcdc',
  },
  title: {
    color: '#444444',
    ...Platform.select({
      ios: {
        fontFamily: 'Vazir-FD',
        fontWeight: 'bold'
      },
      android: {
        fontFamily: 'Vazir-Bold-FD',
      }
    }),
    marginTop: 20,
    width: 190,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  logo: {
    width: 65,
    height: 55,
    top: 10,
    padding: 0,
    resizeMode: 'cover',
  },
})
