
import React,{Component} from 'react';
import {
	StyleSheet,
	Text,
	ScrollView,
	ListView,
	View,
	Image,
	Platform,
	TouchableHighlight,
	ActivityIndicator,
	BackHandler,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Dimensions from 'Dimensions';
import { connect } from 'react-redux';

import { requestMethod,timeFormat } from '../util/RequestClass';
import { reqUrls } from '../util/RequestUrls';


const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
class NoticeScreen extends Component{
	static navigationOptions = {
	    title: '通知',
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
	constructor(props) {
	    super(props);
	    this.state = {
	      dataArray:[],
	      isLoading:true,
	      animating: true,
	      loadSucc:false,
	    };
	    this._loadSucc = this._loadSucc.bind(this);
	    this._loadFail = this._loadFail.bind(this);
	    this._showList = this._showList.bind(this);
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
	    this._loadSucc();
	}

	_loadSucc(rst){
		let list = [
			{
				title:'通知',
				content:'5年来，习近平就是乘坐这架专机，完成28次出访，飞行里程约57万公里，累计时长193天，足迹遍及五大洲、56个国家以及主要国际和区域组织。',
				update_time:1503980263,
			},
			{
				title:'通知',
				content:'明天不上班,',
				update_time:1503980263,
			},
		];
	  // let list = JSON.parse(rst);
      this.setState({dataArray:list});
	  this.setState({isLoading:false});
	  this.setState({loadSucc:true});
	}
	_loadFail(){
	}
	_showList(){
		let list = [];
		this.state.dataArray.forEach((item,index)=>{
			list.push(
			<View key={index} style={styles.noticeItem}>
				<Text style={styles.noticeTitle}>{item.title}</Text>
				<Text style={styles.noticeCtnt}>{item.content}</Text>
				<Text style={styles.noticeTime}>{timeFormat(item.update_time)}</Text>
			</View>
			);
		});
		return list;
	}

	render() {
		if(this.state.loadSucc ){
		    return (
		      <View >
			      <ScrollView style={styles.scrollViewStyle}>
			      {this._showList()}
			      </ScrollView>
		      </View>
		    )
		}else if(this.state.isLoading){
			return (
				<View>
			      	<ActivityIndicator
				      animating={this.state.animating}
				      style={styles.centering}
				      size= 'small'
	               	  color= '#fff'
					/>
				</View>
			)
		}else{
			return (
		      <View>
		      	<View style={styles.noWifiWrapper}>
			      <Image style={styles.wifiImg} source={require('./images/nowifi.png')} />
			      <Text style={styles.reloadText1}>网络状况不佳</Text>
			      <Text style={styles.reloadText2}>请检查您的网络设置</Text>
			      <TouchableHighlight underlayColor='#f4f4f4' activeOpacity={0.9} style={styles.reloadBtn}
			      	onPress = {() => {
			      	this.setState({isLoading:true});
				    requestMethod('GET',reqUrls.collect, null).then(
				      (rst)=>{ this._loadSucc(rst); },
				      (msg)=>{ this._loadFail(); }
				    );
			      }}>
			      	<Text style={styles.reloadText}>重新加载</Text>
			      </TouchableHighlight>
		      	</View>
		      </View>
		    )
		}
	}
	
}
const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
  userInfo:state.auth.userInfo,
});

export default connect(mapStateToProps)(NoticeScreen);


//定义一些全局变量
const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');

const styles = StyleSheet.create({
	noWifiWrapper:{
		width:width,
		height:height,
		flexDirection:'column',
		justifyContent:'flex-start',
		alignItems:'center',
	},
	wifiImg:{
		width:120,
		height:100,
		marginTop:200,
		marginBottom:10,
	},
	reloadBtn:{
		width:160,
		height:30,
		marginTop:15,
		borderWidth:0.5,
		borderColor:'#999',
		borderRadius:8,
		flexDirection:'row',
		justifyContent:'center',
		alignItems:'center',
	},
	reloadText:{
		color:'#333',
		fontSize:16,
	},
	reloadText1:{
		fontSize:16,
		color:'#666',
		marginBottom:8,
	},
	reloadText2:{
		fontSize:12,
		color:'#999',
	},
	centering:{
		position:'absolute',
		width:40,
		height:40,
		marginTop:200,
		marginLeft:(width - 40)/2,
		transform:[{scale:2}],
		backgroundColor:'gray',
		borderRadius:5,
    },

	bgWhite:{
		backgroundColor:'#fff',
	},
	scrollViewStyle:{
		paddingTop:10,
		paddingBottom:10,
	},
	noticeItem:{
		marginHorizontal:10,
		marginBottom:10,
		padding:5,
		backgroundColor:'#fff',
		borderWidth:0.5,
		borderColor:'#ececec',
		borderRadius:5,
	},
	noticeTitle:{
		fontSize:18,
		color:'#333',
		lineHeight:24,
		textAlign:'center',
	},
	noticeCtnt:{
		fontSize:16,
		color:'#666',
		lineHeight:20,
		textAlign:'justify',
	},
	noticeTime:{
		marginTop:5,
		fontSize:16,
		color:'#999',
		lineHeight:20,
		textAlign:'left',
	},
	
});


