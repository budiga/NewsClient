
import React,{Component, PropTypes} from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  Button,
  View,
  Image,
  Platform,
  TouchableHighlight,
  Alert,
  BackHandler,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import Dimensions from 'Dimensions';
import { requestMethod } from '../util/RequestClass';
import { reqUrls } from '../util/RequestUrls';

class SettingScreen extends Component{
  constructor(props) {
      super(props);
  }

  static navigationOptions = {
    title: '设置',
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

  render(){
    return (
      <ScrollView style={styles.sscreenViewStyle} keyboardShouldPersistTaps='handled'>
        <View style={styles.settingArea}>
          <TouchableHighlight style={styles.listItem} onPress={()=>{
            if(!this.props.isLoggedIn){
              this.props.navigation.navigate('Loginscrn');
              return;
            }
            this.props.navigation.navigate('UpdateInfo',{title:'修改密码',setType:'changePwd'});
          }} underlayColor='#f4f4f4' activeOpacity={0.9}>
            <View style={[styles.listItemView,styles.borderBotton]}>
              <Text style={styles.iconText}>修改密码</Text>
              <Image style={styles.arrow} source={require('./images/arrow.png')} />
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={styles.listItem} onPress={()=>{
            if(!this.props.isLoggedIn){
              this.props.navigation.navigate('Loginscrn');
              return;
            }
            this.props.navigation.navigate('UpdateInfo',{title:'绑定邮箱',setType:'bindEmail'});
          }} underlayColor='#f4f4f4' activeOpacity={0.9}>
            <View style={[styles.listItemView,styles.borderBotton]}>
              <Text style={styles.iconText}>绑定邮箱</Text>
              {this.props.isLoggedIn?<View style={styles.showBindEmailView}>
                <Text style={styles.iconText}>{this.props.userInfo.user.email?this.props.userInfo.user.email:''}</Text>
                <Image style={styles.arrow} source={require('./images/arrow.png')} />
                </View>:<Image style={styles.arrow} source={require('./images/arrow.png')} />}
            </View>
          </TouchableHighlight>
        </View>

        <TouchableHighlight style={styles.lgoutButton} onPress={()=>{
            if(!this.props.isLoggedIn){
              this.props.navigation.goBack();
              return;
            }

            requestMethod('POST',reqUrls.logout, null, this.props.userInfo.loginToken, this.props.userInfo.user.id).then(
              (rst)=>{},
              (msg)=>{}
            );

            this.props.Logout();
            this.props.navigation.goBack();

        }} underlayColor='#f4f4f4' activeOpacity={0.9}>
            <Text style={styles.lgoutButtonText}>退出账号</Text>
        </TouchableHighlight>
      </ScrollView>
    );
  }
}

SettingScreen.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  userInfo: PropTypes.object.isRequired,
  Logout: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
  userInfo:state.auth.userInfo,
});

const mapDispatchToProps = dispatch => ({
  Logout: () => dispatch({ type: 'Logout'}),
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen);


//定义一些全局变量
const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');
 
const cols = 3;
const boxH = 160;
const wMargin = 0;

const boxW = (width - (cols+1) * wMargin) / cols;
const hMargin = 0;
const styles = StyleSheet.create({
  sscreenViewStyle:{
    backgroundColor:'#f9f9f9',
  },
  settingArea:{
    borderBottomWidth:0.5,
    borderBottomColor:'#e2e2e2',
  },
  listItem:{
    backgroundColor:'#fff',
  },
  listItemView:{
    height:40,
    marginLeft:20,
    flexDirection:'row',
    paddingRight:10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  showBindEmailView:{
    height:40,
    flexDirection:'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  borderBotton:{
    borderBottomWidth:0.5,
    borderBottomColor:'#e2e2e2',
  },
  iconText:{
    color:'#333',
    fontSize:14,
  },
  arrow:{
    width:7,
    height:11,
    marginLeft:12,
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
    width:90,
    color:'#333',
    fontSize:14,
    textAlign:'center',
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
});




