import React from 'react';
import {Animated, Dimensions, View, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {Actions} from 'react-native-router-flux';

const {height: deviceHeight, width: deviceWidth} = Dimensions.get('window');

export default class BaseLightbox extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			opacity: new Animated.Value(0)
		}
	}

	componentWillMount() {
		Animated.timing(this.state.opacity, {
			toValue: 1,
			duration: 200
		}).start();
	}

	close() {
		Animated.timing(this.state.opacity, {
			toValue: 0,
			duration: 200
		}).start(() => Actions.pop());
	}

	_renderLightbox() {
		const {children, verticalPercent = 1, horizontalPercent = 1} = this.props;
		const width = verticalPercent ? deviceWidth * verticalPercent : deviceWidth;
		const height = horizontalPercent ? deviceHeight * horizontalPercent : deviceHeight;
		return (
			<View style={{
				width,
				height,
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: 'rgba(255,255,255,0.9)',
				borderRadius: 6
			}}>
				{children}
			</View>
		)
	}


	render() {
		return (
			<TouchableWithoutFeedback onPress={() => this.close()}>
				<Animated.View style={[styles.container, {backgroundColor: this.props.backgroundColor}]}>
					{this._renderLightbox()}
				</Animated.View>
			</TouchableWithoutFeedback>
		)
	}
}
const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		justifyContent: 'center',
		alignItems: 'center',
    shadowOffset:{  width: 10,  height: 10},
    shadowColor: 'black',
    shadowOpacity: 1.0,
    backgroundColor: 'rgba(52,52,52,.6)',
	}
})
