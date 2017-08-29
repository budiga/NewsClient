
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
	ToastAndroid,
} from 'react-native';
import { connect } from 'react-redux';
import Dimensions from 'Dimensions';

import Storage from '../../util/Storage';
import { requestMethod ,timeFormat} from '../../util/RequestClass';
import { reqUrls } from '../../util/RequestUrls';
import PluginModule from '../../util/Plugins';


class MineScreen extends Component{
	constructor(props) {
	    super(props);
	    this.state = {
	    	lastBackPressed:0,
	    	noticeList:[],
	    	more:null,
	    };
	    this._getUserInfo = this._getUserInfo.bind(this);
	    this._showUser = this._showUser.bind(this);
	    this._showNotice = this._showNotice.bind(this);
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
		if (this.lastBackPressed && this.lastBackPressed + 3000 >= Date.now()) {
			BackHandler.exitApp();
	    	return false;
	    }
	    this.lastBackPressed = Date.now();
	    ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
	    return true;
	}

	componentDidMount() {



  	}

  	_getUserInfo(){
		Storage.getItem('userInfo').then((ret)=>{
			if(!ret) return ;
			let userInfo = JSON.parse(ret);
			if(userInfo && userInfo.loginToken){
				requestMethod('GET',reqUrls.getUserInfo, null, userInfo.loginToken, userInfo.user.id).then(
			      (rst)=>{
				      let info = JSON.parse(rst);
				      userInfo.user.deadline = info.deadline;
				      userInfo.user.prime = info.prime;
				      userInfo.user.version = info.version;
				      this.props.updateUserInfo(userInfo);
			      },
			      (msg)=>{},
			    );
			}
		});
  	}

  	_showUser(){
  		if(this.props.isLoggedIn){
  			return (
    		<TouchableHighlight   onPress={ ()=> this.props.navigation.navigate('Setting') } underlayColor='#f4f4f4' activeOpacity={0.9}>
  				<View style={styles.userInfoView1}>
  					<Image style={styles.headpic} source={{uri:this.props.userInfo.user.avatar}} />
  					<View>
  						<Text style={styles.loginedinBtn}>{this.props.userInfo.user.username}</Text>
  						<Text style={[styles.loginedinBtn,styles.loginedinBtnSmall]}>ID:{this.props.userInfo.user.invitation_code}</Text>
  						<Text style={[styles.loginedinBtn,styles.loginedinBtnSmall]}>会员:{this.props.userInfo.user.prime? timeFormat(this.props.userInfo.user.deadline):'非会员'}</Text>
  					</View>
  				</View>
  			</TouchableHighlight>
  			);
  		}else{
  			return (
   				<TouchableHighlight   onPress={ ()=> this.props.navigation.navigate('Loginscrn') } underlayColor='#f4f4f4' activeOpacity={0.9}>
  					<View style={styles.userInfoView1}>
  						<Image style={styles.headpic} source={require('../images/head.png')} />
  						<Text style={styles.loginBtn}>登录／注册</Text>
  					</View>
  				</TouchableHighlight>
  			);
  		}
  	}
  	_showNotice(){
  		let list = this.state.noticeList;
  		if(list.length > 0){
  			let arr = [];
  			for(let i=0;i<list.length;i++){
  				arr.push(<Text style={styles.noticeStyle} key={'notice_'+i}>{list[i]}</Text>);
  			}
  			return arr;
  		}
  		return <Text></Text>;
  	}

  	render(){
  		return (
  			<ScrollView style={styles.sscreenViewStyle}>
  				{this._showUser()}
				<View style={styles.sepratorView}/>
				<View>
					<TouchableHighlight style={styles.listItem} onPress={()=>{
						this.props.navigation.navigate('Recharge',{title:'会员充值',reType:'member'});
					}} underlayColor='#f4f4f4' activeOpacity={0.9}>
						<View style={styles.listIconText}>
							<Image style={styles.iconImage} source={require('../images/crow.png')} />
							<View style={styles.listText}>
								<Text style={styles.iconText}>会员充值</Text>
								<Image style={styles.arrow} source={require('../images/arrow.png')} />
							</View>
						</View>
					</TouchableHighlight>
					<TouchableHighlight style={styles.listItem} onPress={()=>{
						this.props.navigation.navigate('Collect');
					}} underlayColor='#f4f4f4' activeOpacity={0.9}>
						<View style={styles.listIconText}>
							<Image style={styles.iconImage} source={require('../images/collect.png')} />
							<View style={styles.listText}>
								<Text style={styles.iconText}>收藏</Text>
								<Image style={styles.arrow} source={require('../images/arrow.png')} />
							</View>
						</View>
					</TouchableHighlight>
					<TouchableHighlight style={styles.listItem} onPress={()=>{
						this.props.navigation.navigate('Notice');
					}} underlayColor='#f4f4f4' activeOpacity={0.9}>
						<View style={styles.listIconText}>
							<Image style={styles.iconImage} source={require('../images/notice.png')} />
							<View style={styles.listText}>
								<Text style={styles.iconText}>通知</Text>
								<Image style={styles.arrow} source={require('../images/arrow.png')} />
							</View>
						</View>
					</TouchableHighlight>
					<TouchableHighlight style={styles.listItem} onPress={()=>{
						this.props.navigation.navigate('Setting');
					}} underlayColor='#f4f4f4' activeOpacity={0.9}>
						<View style={styles.listIconText}>
							<Image style={styles.iconImage} source={require('../images/setting.png')} />
							<View style={styles.listText}>
								<Text style={styles.iconText}>设置</Text>
								<Image style={styles.arrow} source={require('../images/arrow.png')} />
							</View>
						</View>
					</TouchableHighlight>
					{this.state.more?
						<TouchableHighlight style={styles.listItem} onPress={()=>{
							if(Platform.OS === 'android'){
								PluginModule.callThunderWithUrl(this.state.more);
							}
						}} underlayColor='#f4f4f4' activeOpacity={0.9}>
							<View style={styles.listIconText}>
								<Image style={styles.iconImage} source={require('../images/gold.png')} />
								<View style={styles.listText}>
									<Text style={styles.iconText}>更多</Text>
									<Image style={styles.arrow} source={require('../images/arrow.png')} />
								</View>
							</View>
						</TouchableHighlight>:<Text></Text>
					}
					{this._showNotice()}
				</View>
			</ScrollView>
  		);
  	}

}


const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
  userInfo: state.auth.userInfo,
});

const mapDispatchToProps = dispatch => ({
  updateUserInfo: (userData) => dispatch({ type: 'Login', userData: userData}),
});

export default connect(mapStateToProps, mapDispatchToProps)(MineScreen);


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
		backgroundColor:'#fff',
	},
	userInfoView1:{
		height:150,
		paddingLeft:20,
		flexDirection:'row',
		justifyContent: 'flex-start',
	    alignItems: 'center',
	    backgroundColor:'rgba(66, 133, 244, 0.6);'
	},
	headpic:{
		width:80,
		height:80,
		marginRight:15,
		borderRadius:40,
	},
	loginBtn:{
		color:'#333',
		fontSize:18,
	},
	loginedinBtn:{
		color:'#333',
		fontSize:20,
	},
	loginedinBtnSmall:{
		color:'#666',
		fontSize:16,
	},
	userInfoView2:{
		flexDirection:'row',
	},
	userInfoItem:{
		height:50,
		flex:1,
		justifyContent:'center',
		alignItems:'center',
		flexDirection:'column',
	},
	userInfoText1:{
		marginBottom:5,
		fontSize:14,
		color:'#000',
		textAlign:'center',
	},
	userInfoText2:{
		fontSize:12,
		color:'#666',
		textAlign:'center',
	},
	sepratorView:{
		height:10,
		backgroundColor:'#f3f3f3',
	},
	listIconText:{
		width:width,
		paddingLeft:18,
		flexDirection:'row',
		justifyContent: 'flex-start',
	    alignItems: 'center',
	},
	iconImage:{
		width:20,
		height:20,
		marginRight:10,
		resizeMode: Image.resizeMode.contain,
	},
	listText:{
		width:width-44,
		height:40,
		flexDirection:'row',
		paddingRight:10,
		justifyContent: 'space-between',
	    alignItems: 'center',
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
	},
	noticeStyle:{
		marginLeft:20,
		marginTop:15,
		fontSize:20,
		fontWeight:'500',
		color:'red',
	},
});




