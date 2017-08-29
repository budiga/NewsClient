import React from 'react';
import { 
  View,
  Text,
  TouchableHighlight,
  TextInput,
  ScrollView,
  StyleSheet,
  Button,
  TouchableOpacity,
  Alert,
  Platform,
  BackHandler,
}from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import Dimensions from 'Dimensions';
import md5 from 'md5';

import usernameImg from './images/username.png';
import pwdImg from './images/pwd.png';
import UserInput from './login/UserInput';
import { requestMethod } from '../util/RequestClass';
import { reqUrls } from '../util/RequestUrls';

class LoginScreen extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {username: '',password:''};
	    this.setUserInput = this.setUserInput.bind(this);
	    this.loginSubmmit = this.loginSubmmit.bind(this);
	}
  static navigationOptions = {
    title: '登录',
    headerBackTitle:'',
   	headerStyle:{
      backgroundColor:'#fff',
      justifyContent:'center',
    },
    headerTintColor:'#000',
    headerTitleStyle:{
      textAlign:'center',
      alignSelf:'center',
    },
    headerRight:<View/>,
  };
  
  componentWillMount() {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }

  onBackAndroid = () => {
    this.props.navigation.goBack();
    return true;
  }

  render() {
    return (
      <ScrollView style = {styles.register} keyboardShouldPersistTaps='handled'>
       <View style={styles.inputArea}>
        <UserInput source={usernameImg}
          placeholder='用户名'
          returnKeyType={'done'}
          keyboardType={'default'}
          autoCorrect={true}
          secureTextEntry={false}
          autoCapitalize={'none'}
          valueType={'username'}
          setUserInput={this.setUserInput} />
        <UserInput source={pwdImg}
          placeholder='密码'
          returnKeyType={'done'}
          autoCorrect={true}
          secureTextEntry={true}
          keyboardType={'default'}
          autoCapitalize={'none'}
          valueType={'password'}
          setUserInput={this.setUserInput} />
        </View>
        <TouchableHighlight onPress = { this.loginSubmmit }  underlayColor='#f4f4f4' activeOpacity={0.9}
          style = {styles.loginButton}>
          <Text style={styles.loginButtonText}>登 录</Text>
        </TouchableHighlight>
        <View style={styles.registerOrFindPwd}>
        	<TouchableOpacity style={styles.registerButton} underlayColor='#f4f4f4' activeOpacity={0.9} onPress = {() => {this.props.navigation.navigate('Register');}} >
        		<Text style={styles.registerButtonText}>注册</Text>
        	</TouchableOpacity>
        	<TouchableOpacity style={styles.registerButton} underlayColor='#f4f4f4' activeOpacity={0.9} onPress={() => {this.props.navigation.navigate('UpdateInfo',{title:'找回密码',setType:'findPwd'});}}>
	        	<Text style={styles.registerButtonText}>忘记密码</Text>
	        </TouchableOpacity>
	     </View>
      </ScrollView>
    );
  }

  setUserInput(type,value){
  	if(type == 'username'){
  		this.setState({username:value});
  	}else if(type == 'password'){
  		this.setState({password:value});
  	}
  }
  loginSubmmit(){
    if(!this.state.username || !this.state.username.trim()){
      Alert.alert('提示','用户名不能为空',[{text:'确定',onPress:()=>{}}]);
      return;
    }
    if(this.state.username.length < 4){
      Alert.alert('提示','用户名长度不小于4位',[{text:'确定',onPress:()=>{}}]);
      return;
    }
  	if(!this.state.password || !this.state.password.trim()){
  		Alert.alert('提示','密码不能为空',[{text:'确定',onPress:()=>{}}]);
  		return;
  	}

    if(this.state.password.trim().length < 6){
      Alert.alert('提示','密码长度不能小于6位',[{text:'确定',onPress:()=>{}}]);
      return;
    }
    
    let param = {
      username:this.state.username,
      password:md5(this.state.password),
    };
    requestMethod('POST',reqUrls.login, param).then(
      (rst)=>{
        let userData = JSON.parse(rst);
        this.props.login(userData);
        this.props.navigation.goBack();
      },
      (msg)=>{  Alert.alert('提示',msg,[{text:'确定',onPress:()=>{}}]);},
    );
  }
}


const mapDispatchToProps = dispatch => ({
  login: (userData) => dispatch({ type: 'Login', userData: userData }),
});

export default connect(null, mapDispatchToProps)(LoginScreen);

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  register:{
    backgroundColor:'#fff',
  },
  inputArea:{
    paddingTop:20,
  	paddingLeft:10,
    paddingRight:10,
  },
  loginButton:{
    height:40,
    width:DEVICE_WIDTH - 20,
    marginTop:20,
    marginHorizontal: 10,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#4285f4',
    borderRadius:8,
  },
  loginButtonText:{
    color:'#fff',
    fontSize:18,
  },
  registerOrFindPwd:{
  	width:DEVICE_WIDTH - 20,
    marginHorizontal: 10,
    marginTop:5,
  	flexDirection:'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  registerButton:{
  	backgroundColor:'#fff',
  	paddingVertical:10,
  	paddingHorizontal:20,
  },
  registerButtonText:{
  	color:'#4285f4',
  	fontSize:16,
  }

});
