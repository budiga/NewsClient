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


class RechargeScreen extends React.Component {
	constructor(props) {
	    super(props);
      this.state = {
        reType:this.props.navigation.state.params.reType,
        choose:null,
        payType:null,
        payItemList:[],
        noticeList:null,
      };
      this.hash_self = this.hash_self.bind(this);
      this._rechargeFunc = this._rechargeFunc.bind(this);
      this.showPayItems = this.showPayItems.bind(this);
      this._showNotice = this._showNotice.bind(this);
	}
  static navigationOptions = ({navigation}) => {
    return{
      title: navigation.state.params.title,
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

  componentDidMount(){
    // let param = {};
    // if(this.state.reType == 'member') param.type = 'PRIME';
    // requestMethod('GET', reqUrls.payItem,param,this.props.userInfo.loginToken,this.props.userInfo.user.id).then(
    //   (rst) => {
    //     let param = JSON.parse(rst);
    //     this.setState({payItemList:param});
    //   },
    //   (msg) => {}
    // )

    // let param2 = {type:'PRIME'};
    // requestMethod('GET',reqUrls.postList, param2).then(
    //     (rst)=>{
    //       let list = JSON.parse(rst);
    //       if(list){
    //         this.setState({noticeList:list});
    //       }
    //     },
    //     (msg)=>{},
    //   );
    let param = [
      {
        profit:3,
        id:2001,
        charge:6.99,
      },
      {
        profit:6,
        id:2002,
        charge:6.99,
      },
      {
        profit:9,
        id:2003,
        charge:6.99,
      },
      {
        profit:12,
        id:2004,
        charge:6.99,
      },
      {
        profit:24,
        id:2005,
        charge:6.99,
      },
    ];
    this.setState({payItemList:param});
  }

  hash_self(arg , timestamp){
    return '' + (timestamp%100000*arg)&(parseInt(timestamp/100000));
  }

  _rechargeFunc(){
    if(!this.state.exCode || !this.state.exCode.trim()){
      Alert.alert('提示','请输入兑换码',[{text:'确定'}]);
      return;
    }

    let user = this.props.userInfo.user;
    let timestamp = new Date().getTime();
    let coupon = md5(this.state.exCode);
    let signatureStr = '?user_id=' + user.id + '&coupon=' + coupon +'&timestamp=' + this.hash_self(user.id, timestamp);
    let signature = md5(signatureStr);
    let param = {
      coupon: coupon,
      timestamp: timestamp,
      signature: signature,
    };
    requestMethod('PUT',reqUrls.recharge, param, this.props.userInfo.loginToken, user.id).then(
      (rst)=>{
        if(this.state.reType === 'member'){
          this.props.updateDeadline(parseInt(rst));
        }

        Alert.alert('提示','充值成功！',[{text:'确定'}]);
      },
      (msg)=>{  Alert.alert('提示',msg,[{text:'确定'}]); },
    );
  }

  showPayItems(){
    let list = [];
    this.state.payItemList.forEach((ele)=>{
      
      let month = ele.profit;
      let year = Math.floor(month/12);
      month = month % 12;
      let str = '';
      if(year > 0) str += year+'年';
      if(month > 0) str += month+'个月';

      list.push(
        <TouchableHighlight key={ele.id} style={this.state.choose == ele.id?[styles.cashItem,styles.chsBgColor]:styles.cashItem} underlayColor='#f4f4f4' activeOpacity={0.9}
        onPress={()=>{
          this.setState({choose:ele.id});
        }}>
         <View style={styles.cashItemView}>
           <Text style={styles.cashText1}>{this.state.reType=='member'?(str):(ele.profit+'金币')}</Text>
           <Text style={styles.cashText2}>{parseInt(ele.charge) + '元'}</Text>
         </View>
        </TouchableHighlight>
      );
    });
    return list;
  }

  _showNotice(){
    let list = this.state.noticeList;
    if(list && list.length > 0){
      let arr = [];
      for(let i=0;i<list.length;i++){
        arr.push(<Text style={styles.noticeStyle} key={'notice_'+i}>{list[i]}</Text>);
      }
      return arr;
    }
  }
  
  render() {
    return (
      <ScrollView style = {styles.recharge}  keyboardShouldPersistTaps='handled'>
          {this._showNotice()}
          <View style={styles.codeArea}>
            <Text style={styles.codeText}>充值方式一：兑换码充值</Text>
            <View style={styles.codeInput}>
              <TextInput style={styles.input}
                placeholder={this.state.reType === 'member' ? '输入会员充值兑换码':'输入金币充值兑换码'}
                returnKeyType= 'done'
                keyboardType= 'default'
                autoCapitalize= 'none'
                autoCorrect= {true}
                placeholderTextColor='#999'
                underlineColorAndroid='transparent'
                onChangeText={(value) => {
                  console.log(value);
                  this.setState({exCode:value});
                  }
                }
              />
              <TouchableHighlight 
                style = {styles.rechargeButton} underlayColor='#f4f4f4' activeOpacity={0.9}
                onPress={ this._rechargeFunc }>
                <Text style={styles.rechargeButtonText}>立即兑换</Text>
              </TouchableHighlight>
            </View>
          </View>

          <View style={styles.cashArea}>
            <Text style={styles.codeText}>充值方式二：微信／支付宝充值</Text>
            <View style={styles.cashAreaInfo}>
              {this.showPayItems()}
            </View>
          </View>

          <TouchableHighlight style={styles.payListItem} underlayColor='#f4f4f4' activeOpacity={0.9}
          onPress={()=>{
            this.setState({payType:'wechat'});
          }}>
            <View style={styles.payItem}>
              <Image style={styles.payIcon} source={require('./images/wechat.png')} />
              <View style={styles.payText}>
                <Text style={styles.payName}>微信支付</Text>
                <Image style={styles.checked} source={this.state.payType == 'wechat' ? require('./images/check2.png'):require('./images/check1.png')} />
              </View>
            </View>
          </TouchableHighlight>

          <TouchableHighlight style={styles.payListItem} underlayColor='#f4f4f4' activeOpacity={0.9}
          onPress={()=>{
            this.setState({payType:'alipay'});
          }}>
            <View style={styles.payItem}>
              <Image style={styles.payIcon} source={require('./images/alipay.png')} />
              <View style={styles.payText}>
                <Text style={styles.payName}>支付宝支付</Text>
                <Image style={styles.checked} source={this.state.payType == 'alipay' ? require('./images/check2.png') : require('./images/check1.png')} />
              </View>
            </View>
          </TouchableHighlight>

          <View style={styles.cashButtonArea}>
            <TouchableHighlight style={styles.cashButton} underlayColor='#f9f9f9' activeOpacity={0.9}
            onPress={()=>{
            }}>
              <Text style={styles.cashButtonText}>暂缓开通</Text>
            </TouchableHighlight>
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
  updateDeadline: (deadline) => dispatch({ type: 'updateDeadline', deadline:deadline}),
});

export default connect(mapStateToProps, mapDispatchToProps)(RechargeScreen);

//定义一些全局变量
const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');

const cols = 3;
const boxH = 48;
const wMargin = 10;

const boxW = (width - (cols+1) * wMargin) / cols;
const hMargin = 15;

const styles = StyleSheet.create({
  recharge:{
    backgroundColor:'#f9f9f9',
  },
  codeArea:{
    marginBottom:20,
  },
  codeText:{
    marginBottom:5,
    marginTop:10,
    marginLeft:20,
    fontSize:16,
    fontWeight:'500',
    color:'#333',
  },
  codeInput:{
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:20,
    paddingRight:10,
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor:'#fff',
    borderBottomWidth:0.5,
    borderBottomColor:'#ececec',
    borderTopWidth:0.5,
    borderTopColor:'#ececec',
  },
  input:{
    width:width - 120,
    height: 40,
    paddingLeft:5,
    fontSize:14,
    color: '#333',
    backgroundColor:'#fff',
    borderWidth:0.5,
    borderColor:'#e2e2e2',
    borderRadius:8,
  },
  rechargeButton:{
    height:40,
    width:80,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#4285f4',
    borderWidth:0.5,
    borderColor:'#4285f4',
    borderRadius:8,
  },
  rechargeButtonText:{
    color:'#fff',
    fontSize:16,
  },
  cashArea:{
  },
  cashAreaInfo:{
    flexDirection:'row',
    flexWrap:'wrap',
    alignItems:'center',
    backgroundColor:'#fff',
  },
  cashItem:{
    width:boxW,  
    height:boxH,
    marginLeft:wMargin,  
    marginTop:hMargin,
    borderWidth:0.5,
    borderColor:'#e2e2e2',
    borderRadius:8,
  },
  chsBgColor:{
    borderWidth:1,
    borderColor:'#4285f4',
  },
  cashItemView:{
    width:boxW,  
    height:boxH,
    flexDirection:'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cashText1:{
    fontSize:16,
    color:'#333',
  },
  cashText2:{
    marginTop:2,
    fontSize:14,
    color:'#666',
  },
  payItem:{
    width:width,
    paddingLeft:18,
    flexDirection:'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor:'#fff',
  },
  payIcon:{
    width:24,
    height:24,
    marginRight:10,
  },
  payText:{
    width:width-44,
    height:40,
    flexDirection:'row',
    paddingRight:20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  payName:{
    color:'#333',
    fontSize:16,
  },
  checked:{
    width:24,
    height:24,
  },
  cashButtonArea:{
    height:60,
    backgroundColor:'#fff',
  },
  cashButton:{
    height:40,
    width:width-240,
    marginLeft:120,
    marginTop:10,
    backgroundColor:'#f2f2f2',
    borderRadius:8,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cashButtonText:{
    color:'#999',
    fontSize:16,
  },
  noticeStyle:{
    marginLeft:20,
    marginRight:10,
    marginTop:20,
    fontSize:20,
    fontWeight:'500',
    color:'red',
  },
});
