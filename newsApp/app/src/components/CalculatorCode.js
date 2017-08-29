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

import Storage from '../util/Storage';
import { requestMethod } from '../util/RequestClass';
import { reqUrls } from '../util/RequestUrls';


class calculatorCode extends React.Component {
	constructor(props) {
	    super(props);
      this.state = {
        code:'',
        settedCode:null,
      };
      this._rechargeFunc = this._rechargeFunc.bind(this);
	}
  static navigationOptions = {
    title: '伪装密码',
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

  componentDidMount(){
    Storage.getItem('calculatorCode').then((rst)=>{
      if(rst){
        this.setState({settedCode:rst});
      }
    });
  }

  _rechargeFunc(){
    if(!this.state.code && !this.state.code.trim()){
      Alert.alert('提示','密码不能为空',[{text:'确定'}]);
      return;
    }
    let reg = new RegExp("^[0-9]*$");
    if(!reg.test(this.state.code.trim())){
      Alert.alert('提示','密码只能为数字',[{text:'确定'}]);
      return;
    }
    if(this.state.code.length < 6){
      Alert.alert('提示','密码不能少于6位',[{text:'确定'}]);
      return;
    }

    Storage.setItem('calculatorCode',this.state.code).then(
      (rst)=>{
        this.props.cacheCC(this.state.code);
        Alert.alert('提示','设置成功，请牢记此密码！下次进入app需在计算器界面输入此密码！',[{text:'确定',onPress: () => this.props.navigation.goBack()}]);
      },
      (msg)=>{  Alert.alert('提示',msg,[{text:'确定'}]) },
    );
  }
  
  render() {
    return (
      <ScrollView style = {styles.recharge} keyboardShouldPersistTaps='always'>
          <View style={styles.codeArea}>
            <Text style={styles.codeText}>设置伪装密码</Text>
            <View style={styles.codeInput}>
              <TextInput style={styles.input}
                placeholder='输入数字，长度不少于6位'
                returnKeyType= 'done'
                keyboardType= 'numeric'
                autoCapitalize= 'none'
                secureTextEntry={true}
                autoCorrect= {true}
                placeholderTextColor='#999'
                underlineColorAndroid='transparent'
                onChangeText={(value) => {
                  this.setState({code:value});
                  }
                }
              />
               <View style={styles.cashButtonArea}>
                <TouchableHighlight style={styles.cashButton} underlayColor='#f9f9f9' activeOpacity={0.9}
                onPress={this._rechargeFunc}>
                  <Text style={styles.cashButtonText}>立即设置</Text>
                </TouchableHighlight>
              </View>
            </View>
            <Text style={styles.notice}>伪装密码使用说明：</Text>
            <Text style={[styles.notice,styles.redColor]}>1、设置伪装密码后，下次打开app会先进入计算器界面。在计算器界面输入伪装密码，才能进入app（利于保护您的隐私）。</Text>
            <Text style={[styles.notice,styles.redColor]}>2、请牢记您设置的伪装密码。</Text>
            <Text style={styles.notice}>3、密码形式可以简单，长度不少于6位。</Text>
            <Text style={styles.notice}>4、如需更改伪装密码，在上方输入新的密码并点击设置。</Text>
            <Text style={styles.notice}>5、如需删除伪装密码，点击下方清除伪装密码。</Text>
            <TouchableHighlight style={styles.lgoutButton} onPress={()=>{
                if(!this.state.settedCode){
                  Alert.alert('提示','您没有设置过伪装密码',[{text:'确定'}]);
                  return;
                }
                Storage.delete('calculatorCode').then(
                  (rst)=>{
                    this.props.cacheCC('');
                    Alert.alert('提示','清除成功！',[{text:'确定',onPress:()=>{this.props.navigation.goBack();}}]);
                  },
                  (msg)=>{ Alert.alert('提示','清除出错，请再试一次',[{text:'确定'}]); }
                );
            }} underlayColor='#f4f4f4' activeOpacity={0.9}>
                <Text style={styles.lgoutButtonText}>清除伪装密码</Text>
            </TouchableHighlight>
          </View>

      </ScrollView>
    );
  }

}

const mapStateToProps = state => ({
  calculatorCode:state.cc.calculatorCode,
});
const mapDispatchToProps = dispatch => ({
  cacheCC: (calculatorCode) => dispatch({ type: 'cacheCC', calculatorCode: calculatorCode }),
});

export default connect(mapStateToProps,mapDispatchToProps)(calculatorCode);

// export default calculatorCode;

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
    fontSize:16,
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
    backgroundColor:'#4285f4',
    borderRadius:8,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cashButtonText:{
    color:'#fff',
    fontSize:16,
  },
  notice:{
    marginTop:5,
    marginLeft:20,
    fontSize:14,
    color:'#999',
  },
  redColor:{
    color:'red',
  },
  lgoutButton:{
    height:40,
    marginTop:20,
    backgroundColor:'#fff',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
  },
  lgoutButtonText:{
    width:150,
    color:'#4285f4',
    fontSize:16,
    textAlign:'center',
  },
 
});
