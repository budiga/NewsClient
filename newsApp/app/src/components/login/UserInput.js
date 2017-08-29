import React, { Component, PropTypes } from 'react';
import Dimensions from 'Dimensions';
import {
	StyleSheet,
	View,
	TextInput,
	Image,
	TouchableOpacity,
} from 'react-native';

export default class UserInput extends Component {
	constructor(props) {
	    super(props);
	    this.state = {showDelete: false};
	    this.clearInput = this.clearInput.bind(this);
	}
	render() {
		let displayProp = this.state.showDelete?'flex':'flex';
		return (
			<View style={styles.inputWrapper}>
				<Image source={this.props.source}
					style={styles.inlineImg} />
				<TextInput style={styles.input}
					placeholder={this.props.placeholder}
					returnKeyType={this.props.returnKeyType}
					keyboardType={this.props.keyboardType}
					secureTextEntry={this.props.secureTextEntry}
					autoCapitalize={this.props.autoCapitalize}
					autoCorrect={this.props.autoCorrect}
					autoFocus={this.props.autoFocus}
					placeholderTextColor='#999'
					underlineColorAndroid='transparent'
					onChangeText={(value) => {
						if(value) this.setState({showDelete:true});
						else this.setState({showDelete:false});
						this.props.setUserInput(this.props.valueType,value);}
					}
					ref = {(TextInput) => {this.textInput = TextInput; }}
				/>
			</View>
		);
	}
	clearInput(){
		this.textInput.clear();
		this.textInput.focus();
		this.setState({showDelete:false});
		this.props.setUserInput(this.props.valueType,this.textInput.value);
	}
}

UserInput.propTypes = {
	source: PropTypes.number.isRequired,
	placeholder: PropTypes.string.isRequired,
	returnKeyType: PropTypes.string,
};

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
	inputWrapper:{
		borderBottomWidth:0.5,
		borderBottomColor:'#ececec',
	},
	input: {
		width: DEVICE_WIDTH - 20,
		height: 40,
		paddingLeft: 30,
		color: '#333',
		fontSize:14,
	},
	inlineImg: {
		position: 'absolute',
		zIndex: 99,
		width: 20,
		height: 20,
		left: 0,
		top: 8,
		resizeMode: Image.resizeMode.contain,
	},
	btnDelete:{
		position: 'absolute',
		zIndex: 9999,
		width: 16,
		height: 16,
		right: 0,
		top: 13,
	},
	deleteImg:{
		width: '100%',
		height: '100%',
	},
});
