import React from 'react';
import { 
  View,
  Text,
  TouchableHighlight,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  BackHandler,
  Platform,
}from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import md5 from 'md5';
import Dimensions from 'Dimensions';

import UserInput from './login/UserInput';
import usernameImg from './images/username.png';
import pwdImg from './images/pwd.png';
import conPwdImg from './images/conPwd.png';
import inviteImg from './images/invite.png';
import emailImg from './images/email.png';
import { requestMethod } from '../util/RequestClass';
import { reqUrls } from '../util/RequestUrls';

const resetAction = NavigationActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({routeName: 'Main',params: {selectedTab: 'Mine'}})
  ]
});

class RegisterScreen extends React.Component {
  constructor(props) {
      super(props);
      this.state = {username: '',password:'',confirmPwd:'',email:'',};
      this.setUserInput = this.setUserInput.bind(this);
      this.registerSubmmit = this.registerSubmmit.bind(this);
  }
  static navigationOptions = {
    title: '注册',
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
          placeholder='用户名(4-16位数字/字母或组合)'
          returnKeyType={'done'}
          keyboardType={'default'}
          autoCorrect={true}
          secureTextEntry={false}
          autoCapitalize={'none'}
          valueType={'username'}
          setUserInput={this.setUserInput}
          />
        <UserInput source={pwdImg}
          placeholder='密码(大于6位数字/字母或组合)'
          returnKeyType={'done'}
          keyboardType={'default'}
          autoCorrect={true}
          secureTextEntry={true}
          valueType={'password'}
          setUserInput={this.setUserInput}
          />
          <UserInput source={conPwdImg}
          placeholder='确认密码'
          returnKeyType={'done'}
          keyboardType={'default'}
          autoCorrect={true}
          secureTextEntry={true}
          valueType={'confirmPwd'}
          setUserInput={this.setUserInput}
          />
          <UserInput source={emailImg}
          placeholder='邮箱（用来找回密码，可以之后绑定）'
          returnKeyType={'done'}
          keyboardType={'email-address'}
          autoCorrect={true}
          secureTextEntry={false}
          valueType={'email'}
          setUserInput={this.setUserInput}
          />
          <UserInput source={inviteImg}
          placeholder='邀请码（用户ID,可不填）'
          returnKeyType={'done'}
          keyboardType={'default'}
          autoCorrect={true}
          secureTextEntry={false}
          valueType={'inviter'}
          setUserInput={this.setUserInput}
          />
        </View>
        <TouchableHighlight onPress = { this.registerSubmmit } 
          style = {styles.registerButton}>
          <Text style={styles.bottonText}>注 册</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress = { () => {
          this.props.navigation.goBack();}} 
          style = {styles.registerButton2}>
          <Text style={styles.bottonText2}>返回登录</Text>
        </TouchableHighlight>
      </ScrollView>
    );
  }

  setUserInput(type,value){
    if(type == 'username'){
      this.setState({username:value});
    }else if(type == 'password'){
      this.setState({password:value});
    }else if(type == 'email'){
       this.setState({email:value});
    }else if(type == 'confirmPwd'){
       this.setState({confirmPwd:value});
    }else if(type == 'inviter'){
      this.setState({inviter:value});
    }

  }
  registerSubmmit(){
    let unReg = /^([0-9]|[a-z]|[A-Z]){1,}$/ ;
    let nameReg = /^[a-zA-Z0-9_-]{4,16}$/;

    if( !this.state.username || !this.state.username.trim() ){
      Alert.alert('提示','用户名不能为空',[{text:'确定'}]);
      return;
    }
    if(!nameReg.test(this.state.username)){
      Alert.alert('提示','用户名只能用数字和字母组合',[{text:'确定'}]);
      return;
    }
    if(this.state.username.length > 16){
      Alert.alert('提示','用户名长度不能超过16位',[{text:'确定'}]);
      return;
    }
    if( !this.state.password || !this.state.password.trim() ){
      Alert.alert('提示','密码不能为空',[{text:'确定'}]);
      return;
    }
    if(this.state.password.trim().length < 6 ){
      Alert.alert('提示','密码长度不能小于6位',[{text:'确定'}]);
      return;
    }
    if(!unReg.test(this.state.password)){
      Alert.alert('提示','密码只能输入数字或字母',[{text:'确定'}]);
      return;
    }
    if( this.state.password != this.state.confirmPwd ){
      Alert.alert('提示','两次输入密码不一致',[{text:'确定'}]);
      return;
    }
    
    let param = {
      "username":this.state.username,
      "password":md5(this.state.password),
      "email":this.state.email,
      "inviter":this.state.inviter,
    };
    requestMethod('POST',reqUrls.register, param).then(
      (rst)=>{
        let userData = JSON.parse(rst);
        this.props.Login(userData);
        this.props.navigation.dispatch(resetAction);
      },
      (msg)=>{  Alert.alert('提示',msg,[{text:'确定'}]) },
    );
  }
}


const mapDispatchToProps = dispatch => ({
  Login: (userData) => dispatch({ type: 'Login', userData: userData }),
});

export default connect(null, mapDispatchToProps)(RegisterScreen);

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
  registerButton:{
    height:40,
    width:DEVICE_WIDTH - 20,
    marginTop:10,
    marginHorizontal: 10,
    flexDirection:'row',
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#4285f4',
    borderRadius:8,
  },
  registerButton2:{
    height:40,
    width:DEVICE_WIDTH - 20,
    marginTop:10,
    marginHorizontal: 10,
    flexDirection:'row',
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth:0.5,
    borderColor:'#4285f4',
    borderRadius:8,
  },
  bottonText:{
    fontSize:16,
    color:'#fff',
  },
  bottonText2:{
    fontSize:16,
    color:'#4285f4',
  },
});


