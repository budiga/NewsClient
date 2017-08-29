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
  BackHandler,
  Platform,
}from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import Dimensions from 'Dimensions';
import md5 from 'md5';

import { requestMethod } from '../util/RequestClass';
import { reqUrls } from '../util/RequestUrls';


class UpdateInfoScreen extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
        setType:this.props.navigation.state.params.setType,
        changePwd:{},
        bindEmail:null,
        bindEmailPwd:null,
        findPwdEmail:null,
        findPwdParam:{},
        findPwdStep:1,
      };
      this.showEle = this.showEle.bind(this);
      this.hash_self = this.hash_self.bind(this);
      this.sureSubmit = this.sureSubmit.bind(this);
      this._loadSucc = this._loadSucc.bind(this);
      this._loadFail = this._loadFail.bind(this);

	}
  static navigationOptions = ({navigation}) => {
    return{
      title:navigation.state.params.title,
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
    }
  }

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

        {this.showEle()}

        <TouchableHighlight onPress = { this.sureSubmit } underlayColor='#f4f4f4' activeOpacity={0.9} 
          style = {styles.loginButton}>
          <Text style={styles.loginButtonText}>确定</Text>
        </TouchableHighlight>
      </ScrollView>
    );
  }

  showEle(){
  	if(this.state.setType === 'changePwd'){
      return <View style={styles.inputArea}>
            <View style={[styles.inputItem,styles.itenBorderBottom]}>
              <Text style={styles.inputItemText}>原密码</Text>
              <TextInput style={styles.input}
                placeholder='输入原始密码'
                returnKeyType= 'done'
                secureTextEntry= {true}
                keyboardType= 'default'
                autoCapitalize= 'none'
                autoCorrect= {true}
                placeholderTextColor='#999'
                underlineColorAndroid='transparent'
                onChangeText={(value) => {
                  let newObj = this.state.changePwd;
                  newObj.oldPwd = value;
                  this.setState({changePwd:newObj});
                  }
                }
              />
            </View>
            <View style={[styles.inputItem,styles.itenBorderBottom]}>
                <Text style={styles.inputItemText}>新密码</Text>
                <TextInput style={styles.input}
                  placeholder='6-16位数字／字母组合'
                  returnKeyType= 'done'
                  secureTextEntry= {true}
                  keyboardType= 'default'
                  autoCapitalize= 'none'
                  autoCorrect= {true}
                  placeholderTextColor='#999'
                  underlineColorAndroid='transparent'
                  onChangeText={(value) => {
                     let newObj = this.state.changePwd;
                      newObj.newPwd = value;
                      this.setState({changePwd:newObj});
                    }
                  }
              />
              </View>
              <View style={styles.inputItem}>
                <Text style={styles.inputItemText}>确定密码</Text>
                <TextInput style={styles.input}
                  placeholder='再次确定密码'
                  returnKeyType= 'done'
                  secureTextEntry= {true}
                  keyboardType= 'default'
                  autoCapitalize= 'none'
                  autoCorrect= {true}
                  placeholderTextColor='#999'
                  underlineColorAndroid='transparent'
                  onChangeText={(value) => {
                     let newObj = this.state.changePwd;
                      newObj.surePwd = value;
                      this.setState({changePwd:newObj});
                    }
                  }
                />
              </View>
            </View>
        }
        if(this.state.setType === 'bindEmail'){
          return <View style={styles.inputArea}>
            <View style={styles.inputItem}>
              <Text style={styles.inputItemText}>邮箱</Text>
              <TextInput style={styles.input}
                placeholder='输入要绑定的邮箱'
                returnKeyType= 'done'
                keyboardType= 'default'
                autoCapitalize= 'none'
                autoCorrect= {true}
                placeholderTextColor='#999'
                underlineColorAndroid='transparent'
                onChangeText={(value) => {
                  this.setState({bindEmail:value});
                }}
              />
            </View>
            <View style={styles.inputItem}>
              <Text style={styles.inputItemText}>密码</Text>
              <TextInput style={styles.input}
                placeholder='为保证是本人，请输入账号密码'
                returnKeyType= 'done'
                secureTextEntry={true}
                keyboardType= 'default'
                autoCapitalize= 'none'
                autoCorrect= {true}
                placeholderTextColor='#999'
                underlineColorAndroid='transparent'
                onChangeText={(value) => {
                  this.setState({bindEmailPwd:value});
                }}
              />
            </View>
          </View>
        }
        if(this.state.setType === 'findPwd'){
          return <View style={styles.inputArea}>
            <View style={styles.findPwdTextView}><Text style={styles.findPwdText}>第一步：发送验证码至邮箱</Text></View>
            <View style={styles.inputItem}>
              <Text style={styles.inputItemText}>邮箱</Text>
              <TextInput style={styles.inputFindPwd}
                placeholder='输入邮箱以接收验证码'
                returnKeyType= 'done'
                keyboardType= 'default'
                autoCapitalize= 'none'
                autoCorrect= {true}
                placeholderTextColor='#999'
                underlineColorAndroid='transparent'
                onChangeText={(value) => {
                  this.setState({findPwdEmail:value});
                  }
                }
              />
              <TouchableHighlight onPress = { () => {
                if(this.state.findPwdStep === 2) return;
                this.sureSubmit();}
              } underlayColor='#f4f4f4' activeOpacity={0.9} 
                style = {styles.FindPwdButton}>
                <Text style={styles.loginButtonText}>立即发送</Text>
              </TouchableHighlight>
            </View>
            <View style={styles.findPwdTextView}><Text style={styles.findPwdText}>第二步：用已收到邮箱验证码重新设置密码</Text></View>
            <View style={[styles.inputItem,styles.itenBorderBottom]}>
              <Text style={styles.inputItemText}>用户名</Text>
              <TextInput style={styles.input}
                placeholder='输入用户名'
                returnKeyType= 'done'
                keyboardType= 'default'
                autoCapitalize= 'none'
                autoCorrect= {true}
                placeholderTextColor='#999'
                underlineColorAndroid='transparent'
                onChangeText={(value) => {
                  let newObj = this.state.findPwdParam;
                  newObj.username = value;
                  this.setState({findPwdParam:newObj});
                  }
                }
              />
            </View>
            <View style={[styles.inputItem,styles.itenBorderBottom]}>
                <Text style={styles.inputItemText}>验证码</Text>
                <TextInput style={styles.input}
                  placeholder='请至邮箱查看'
                  returnKeyType= 'done'
                  keyboardType= 'default'
                  autoCapitalize= 'none'
                  autoCorrect= {true}
                  placeholderTextColor='#999'
                  underlineColorAndroid='transparent'
                  onChangeText={(value) => {
                     let newObj = this.state.findPwdParam;
                      newObj.captcha = value;
                      this.setState({findPwdParam:newObj});
                    }
                  }
              />
              </View>
              <View style={styles.inputItem}>
                <Text style={styles.inputItemText}>新密码</Text>
                <TextInput style={styles.input}
                  placeholder='长度大于6位数字／字母组合'
                  returnKeyType= 'done'
                  secureTextEntry= {true}
                  keyboardType= 'default'
                  autoCapitalize= 'none'
                  autoCorrect= {true}
                  placeholderTextColor='#999'
                  underlineColorAndroid='transparent'
                  onChangeText={(value) => {
                     let newObj = this.state.findPwdParam;
                      newObj.newPwd = value;
                      this.setState({findPwdParam:newObj});
                    }
                  }
                />
              </View>
          </View>
        }
  }

  hash_self(arg , timestamp){
    return '' + (timestamp%100000*arg)&(parseInt(timestamp/100000));
  }

  sureSubmit(){
  	if(this.state.setType === 'changePwd'){
      let param = this.state.changePwd;
      if(!param.oldPwd || !param.oldPwd.trim()){
        Alert.alert('提示','原始密码不能为空',[{text:'确定' }]);
        return;
      }
      if(!param.newPwd || !param.newPwd.trim()){
        Alert.alert('提示','新不能为空',[{text:'确定' }]);
        return;
      }
      if( param.newPwd != param.surePwd ){
        Alert.alert('提示','两次输入的新密码不一致',[{text:'确定' }]);
        return;
      }
    }
    let isemail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/ ;
    if(this.state.setType === 'bindEmail'){
      if( !this.state.bindEmail || !this.state.bindEmail.trim() ){
        Alert.alert('提示','请输入邮箱',[{text:'确定' }]);
        return;
      }
      if(!isemail.test(this.state.bindEmail)){
        Alert.alert('提示','请输入合法的邮箱',[{text:'确定' }]);
        return;
      }
      if( !this.state.bindEmailPwd || !this.state.bindEmailPwd.trim() ){
        Alert.alert('提示','请输入密码',[{text:'确定' }]);
        return;
      }
    }
    if(this.state.setType === 'findPwd' && this.state.findPwdStep === 1){
      if( !this.state.findPwdEmail || !this.state.findPwdEmail.trim() ){
        Alert.alert('提示','请输入邮箱',[{text:'确定' }]);
        return;
      }
      if(!isemail.test(this.state.findPwdEmail)){
        Alert.alert('提示','请输入合法的邮箱',[{text:'确定' }]);
        return;
      }
    }
    if(this.state.setType === 'findPwd' && this.state.findPwdStep === 2){
      let param = this.state.findPwdParam;
      if( !param.username || !param.username.trim() ){
        Alert.alert('提示','请输入用户名',[{text:'确定' }]);
        return;
      }
      if( !param.captcha || !param.captcha.trim() ){
        Alert.alert('提示','请输入邮箱验证吗',[{text:'确定' }]);
        return;
      }
      if( !param.newPwd || !param.newPwd.trim() ){
        Alert.alert('提示','请输入新密码',[{text:'确定' }]);
        return;
      }
      if(param.newPwd.length < 6){
        Alert.alert('提示','密码长度至少为6位',[{text:'确定' }]);
        return;
      }
    }

    let param;
    let timestamp = new Date().getTime();
    let userInfo = this.props.userInfo.user;
    if(this.state.setType === 'changePwd'){
      let signatureStr = '?user_id=' + userInfo.id + '&opwd=' + md5(this.state.changePwd.oldPwd) +'&npwd=' + md5(this.state.changePwd.newPwd) + '&timestamp=' + this.hash_self(userInfo.id, timestamp);
      let signature = md5(signatureStr);
      param = {
        opwd:md5(this.state.changePwd.oldPwd),
        npwd:md5(this.state.changePwd.newPwd),
        timestamp:timestamp,
        signature:signature,
      };
      requestMethod('PUT',reqUrls.resetPwd, param, this.props.userInfo.loginToken, userInfo.id).then(
        (rst)=>{ this._loadSucc(rst); },
        (msg)=>{ this._loadFail(msg); }
      );
    }
    if(this.state.setType === 'bindEmail'){
      let signatureStr = '?user_id=' + userInfo.id + '&email=' + this.state.bindEmail + '&timestamp=' + this.hash_self(userInfo.id, timestamp)+'&version=' + userInfo.version ;
      let signature = md5(signatureStr);
      param = {
        email:this.state.bindEmail,
        timestamp:timestamp,
        password:md5(this.state.bindEmailPwd),
        signature:signature,
      };
      requestMethod('PUT',reqUrls.bindEmail, param, this.props.userInfo.loginToken, userInfo.id).then(
        (rst)=>{ this._loadSucc(rst); },
        (msg)=>{ this._loadFail(msg); }
      );
    }

    if(this.state.setType === 'findPwd' && this.state.findPwdStep === 1){
      param = {
        email:this.state.findPwdEmail,
      };
      requestMethod('POST',reqUrls.bindEmail, param ).then(
        (rst)=>{ this._loadSucc(rst); },
        (msg)=>{ this._loadFail(msg); }
      );
    }
    if(this.state.setType === 'findPwd' && this.state.findPwdStep === 2){
      let params = this.state.findPwdParam;
      let captcha = md5(params.captcha);
      let pwd = md5(params.newPwd);
      let signatureStr = '?username=' + params.username + '&captcha=' + params.captcha +'&pwd=' + pwd + '&timestamp=' + timestamp;
      let signature = md5(signatureStr);
      param = {
        username:params.username,
        captcha:captcha,
        pwd:pwd,
        timestamp:timestamp,
        signature:signature,
      };
      requestMethod('POST',reqUrls.resetPwd, param ).then(
        (rst)=>{ this._loadSucc(rst); },
        (msg)=>{ this._loadFail(msg); }
      );
    }

  }

  _loadSucc(rst){
    if(this.state.setType === 'changePwd'){
      Alert.alert('提示','修改密码成功！',[{text:'确定',onPress:()=>{this.props.navigation.goBack();}}]);
      return;
    }
    if(this.state.setType === 'bindEmail'){
      this.props.UpdateVersion(rst);

      let email = this.state.bindEmail;
      let strs = email.split('@');
      let len = strs[0].length;
      let hide_len = Math.floor(strs[0].length/2);
      if(hide_len > 6){
        hide_len = 6;
      }
      if(hide_len > 0){
        email = (strs[0].slice(0,len-hide_len) + new Array(hide_len+1).join('*') + '@' + strs[1]);
      }else if(hide_len ==0){
        email =  '*@' + strs[1];
      }

      this.props.UpdateEmail(email);
      Alert.alert('提示','邮箱绑定成功！',[{text:'确定',onPress:()=>{this.props.navigation.goBack();}}]);
      return;
    }
    if(this.state.setType === 'findPwd' && this.state.findPwdStep === 1){
      this.setState({findPwdStep:2});
      Alert.alert('提示','验证码已成功发送到邮箱',[{text:'确定' }]);
      return;
    }
    if(this.state.setType === 'findPwd' && this.state.findPwdStep === 2){
      this.setState({findPwdStep:1});
      Alert.alert('提示','密码修改成功,请牢记您的新密码',[{text:'确定',onPress:()=>{this.props.navigation.goBack();}}]);
    }
  }
  _loadFail(msg){
    Alert.alert('提示',msg,[{text:'确定' }]);
  }


}

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
  userInfo: state.auth.userInfo,
});

const mapDispatchToProps = dispatch => ({
  UpdateVersion: (version) => dispatch({ type: 'updateVersion', version: version }),
  UpdateEmail:(email) => dispatch({ type: 'updateEmail', email: email }),
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateInfoScreen);

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  register:{
    backgroundColor:'#f9f9f9',
  },
  inputArea:{
    backgroundColor:'#fff',
  },
  inputItem:{
    height:40,
    marginLeft:10,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',

  },
  itenBorderBottom:{
    borderBottomWidth:0.5,
    borderBottomColor:'#e2e2e2',
  },
  inputItemText:{
    width:70,
    textAlign:'justify',
    fontSize:16,
    color:'#333',
  },
  input:{
    height:40,
    width:DEVICE_WIDTH-70,
    fontSize:14,
  },
  inputFindPwd:{
    height:40,
    width:DEVICE_WIDTH-180,
    fontSize:14,
  },
  FindPwdButton:{
    height:36,
    width:90,
    marginRight:10,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#4285f4',
    borderRadius:8,
  },
  findPwdTextView:{
    paddingTop:20,
    paddingLeft:10,
    paddingBottom:5,
    borderBottomWidth:0.5,
    borderBottomColor:'#e2e2e2',
    borderTopWidth:0.5,
    borderTopColor:'#e2e2e2',
    backgroundColor:'#f9f9f9',
  },
  findPwdText:{
    fontSize:16,
    fontWeight:'500',
    color:'#333',
  },
  loginButton:{
    height:40,
    width:DEVICE_WIDTH - 40,
    marginTop:20,
    marginHorizontal: 20,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#4285f4',
    borderRadius:8,
  },
  loginButtonText:{
    color:'#fff',
    fontSize:16,
  },
  

});
