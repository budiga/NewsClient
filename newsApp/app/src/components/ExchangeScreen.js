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
  Image,
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


class ExchangeScreen extends React.Component {
	constructor(props) {
	    super(props);
      this.state = {
        friendId:'',
        amount:'',
        gold:this.props.userInfo.user.gold,
      };
      this.hash_self = this.hash_self.bind(this);
      this._rechargeFunc = this._rechargeFunc.bind(this);
	}
  static navigationOptions = {
    title: '转金币',
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

  hash_self(arg , timestamp){
    return '' + (timestamp%100000*arg)&(parseInt(timestamp/100000));
  }

  _rechargeFunc(){
    if(!this.state.friendId && !this.state.friendId.trim()){
      Alert.alert('提示','好友ID不能为空',[{text:'确定'}]);
      return;
    }
    if(!this.state.amount && !this.state.amount.trim()){
      Alert.alert('提示','金币数量不能为空',[{text:'确定'}]);
      return;
    }
    let reg = new RegExp("^[0-9]*$");
    if(!reg.test(this.state.amount.trim())){
      Alert.alert('提示','金币数量只能为数字',[{text:'确定'}]);
      return;
    }
    if(this.state.amount > this.props.userInfo.user.gold){
      Alert.alert('提示','金币数量不足',[{text:'确定'}]);
      return;
    }

    let user = this.props.userInfo.user;
    let timestamp = new Date().getTime();
    let signatureStr = '?user_id=' + user.id + '&payee_id=' + this.hash_self(this.state.friendId, timestamp)+ '&amount=' + this.state.amount  + '&timestamp=' + timestamp  + '&version=' + user.version;
    let signature = md5(signatureStr);
    let param = {
      payee:parseInt(this.state.friendId),
      amount:parseInt(this.state.amount),
      timestamp: timestamp,
      signature: signature,
    };
    requestMethod('PUT',reqUrls.exchange, param, this.props.userInfo.loginToken, user.id).then(
      (rst)=>{
        this.props.updateVersion(rst);
        this.setState({gold:this.state.gold-this.state.amount});
        Alert.alert('提示','转账成功！',[{text:'确定'}]);
      },
      (msg)=>{  Alert.alert('提示',msg,[{text:'确定',onPress: () => this.props.navigation.goBack()}]) },
    );
  }
  
  render() {
    return (
      <ScrollView style = {styles.recharge} keyboardShouldPersistTaps='handled'>
          <View style={styles.codeArea}>
            <Text style={styles.codeText}>转金币给好友</Text>
            <View style={styles.codeInput}>
              <TextInput style={styles.input}
                placeholder='好友ID'
                returnKeyType= 'done'
                keyboardType= 'default'
                autoCapitalize= 'none'
                autoCorrect= {true}
                placeholderTextColor='#999'
                underlineColorAndroid='transparent'
                onChangeText={(value) => {
                  this.setState({friendId:value});
                  }
                }
                ref = {(TextInput) => {this.textInput = TextInput; }}
              />
              <TextInput style={styles.input}
                placeholder='转账数量'
                returnKeyType= 'done'
                keyboardType= 'default'
                autoCapitalize= 'none'
                autoCorrect= {true}
                placeholderTextColor='#999'
                underlineColorAndroid='transparent'
                onChangeText={(value) => {
                  this.setState({amount:value});
                  }
                }
                ref = {(TextInput) => {this.textInput = TextInput; }}
              />
              <View style={styles.cashButtonArea}>
                <TouchableHighlight style={styles.cashButton} underlayColor='#f9f9f9' activeOpacity={0.9}
                onPress={this._rechargeFunc}>
                  <Text style={styles.cashButtonText}>立即转账</Text>
                </TouchableHighlight>
              </View>
            </View>
            <Text style={styles.notice}>温馨提示：您当前可用于转出的金币剩余{this.props.isLoggedIn ? this.state.gold : '--'}个</Text>
          </View>

      </ScrollView>
    );
  }

}

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
  userInfo:state.auth.userInfo,
});

const mapDispatchToProps = dispatch => ({
  updateVersion: (version) => dispatch({ type: 'updateVersion', version:version}),
});

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeScreen);

//定义一些全局变量
const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');

const styles = StyleSheet.create({
  recharge:{
    backgroundColor:'#f9f9f9',
    paddingTop:20,
  },
  codeArea:{
    marginBottom:30,
  },
  codeText:{
    marginBottom:5,
    marginLeft:20,
    fontSize:14,
    color:'#333',
  },
  codeInput:{
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:20,
    paddingRight:20,
    backgroundColor:'#fff',
    borderBottomWidth:0.5,
    borderBottomColor:'#ececec',
    borderTopWidth:0.5,
    borderTopColor:'#ececec',
  },
  input:{
    width:width - 40,
    height: 40,
    marginBottom:10,
    paddingLeft:5,
    fontSize:14,
    color: '#333',
    backgroundColor:'#fff',
    borderWidth:0.5,
    borderColor:'#e2e2e2',
    borderRadius:8,
  },
  cashButtonArea:{
    height:60,
    backgroundColor:'#fff',
  },
  cashButton:{
    height:40,
    width:width-40,
    marginTop:10,
    backgroundColor:'#4dbf4d',
    borderRadius:8,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cashButtonText:{
    color:'#fff',
    fontSize:14,
  },
  notice:{
    marginTop:5,
    marginLeft:20,
    fontSize:12,
    color:'#999',
  }
 
});
