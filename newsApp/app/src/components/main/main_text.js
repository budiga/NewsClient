
import React,{Component} from 'react';
import {
	StyleSheet,
	Text,
	ScrollView,
	ListView,
	View,
	Image,
	Platform,
	Alert,
	TouchableHighlight,
	ActivityIndicator,
	BackHandler,
	ToastAndroid,
	AppState,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Dimensions from 'Dimensions';
import { connect } from 'react-redux';

import Storage from '../../util/Storage';
import { requestMethod } from '../../util/RequestClass';
import { reqUrls } from '../../util/RequestUrls';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
class TextScreen extends Component{
	constructor(props) {
	    super(props);
	    this.state = {
	    	from:this.props.category,
	    	value:this.props.value,
	      	dataArray:[],
	      	page:1,
	      	totalPage:0,
	      	isLoading:true,
	      	animating: true,
	      	loadSucc:false,
	      	connected:true,
	      	hasMore:false,
	      	appState:AppState.currentState,
	      	calculatorCode:this.props.calculatorCode,
	    };
	    this._renderRow = this._renderRow.bind(this);
	    this._loadMoreFunc = this._loadMoreFunc.bind(this);
	    this._footer = this._footer.bind(this);
	    this._clickItem = this._clickItem.bind(this);
	    this._loadSucc = this._loadSucc.bind(this);
	    this._loadFail = this._loadFail.bind(this);
	    this._getUserInfo = this._getUserInfo.bind(this);

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

	componentWillMount(){
		if(this.props.category == 'textScreen' && this.props.value == 1){
			Storage.getItem('calculatorCode').then((rst)=>{
				if(rst){
					this.props.cacheCC(rst);
				}
			});
		}

		if (Platform.OS === 'android') {
			BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
		}

	}
	componentDidMount(){
		// if(this.state.from == 'textScreen' && this.state.value === 1){
		// 	this._getUserInfo();
		// }
	 //    let param = {
	 //      page_num:this.state.page,
  //   	  per_page:20,
  //   	  type:this.props.value,
	 //    };

	    // if(this.state.from === 'imageScreen'){
		   //  let url = reqUrls.imageList;
		   //  requestMethod('GET',url, param).then(
		   //    (rst)=>{ this._loadSucc(rst); },
		   //    (msg)=>{ this._loadFail(); }
		   //  );
	    // }
	    // if(this.state.from === 'textScreen'){
		   //  let url = reqUrls.textList;
		   //  requestMethod('GET',url, param).then(
		   //    (rst)=>{ this._loadSucc(rst); },
		   //    (msg)=>{ this._loadFail(); }
		   //  );
	    // }
	    this._loadSucc();
	    AppState.addEventListener('change', this._handleAppStateChange);
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

	componentWillUnmount() {
	  	AppState.removeEventListener('change', this._handleAppStateChange);
	}
	_handleAppStateChange = (nextAppState) => {
		let onceFlag = false;
		if (Platform.OS === 'android' && this.props.value == 1 && this.props.category == 'textScreen') {
			if(!onceFlag && this.state.appState == 'active' && nextAppState == 'background' && this.props.calculatorCode){
				let routes = this.props.routes;
				let len = routes.length;
				if(routes[len-1].routeName == 'Calculator'){
					onceFlag = true;
					return;
				}
				onceFlag = true;
				this.props.navigation.navigate('Calculator');
			}
		}
		if (Platform.OS === 'ios'&& this.props.value == 1 && this.props.category == 'textScreen') {
			if(!onceFlag && this.state.appState == 'active' && nextAppState == 'inactive' && this.props.calculatorCode){
				let routes = this.props.routes;
				let len = routes.length;
				if(routes[len-1].routeName == 'Calculator'){
					onceFlag = true;
					return;
				}
				this.props.navigation.navigate('Calculator');
				onceFlag = true;
			}
		}

		if(this.state.appState == 'active'){
			onceFlag = false;
		}
		this.setState({appState: nextAppState});
	}

	_loadSucc(rst){
		let list = [
			{
				id:100,
				title:'全运会“变”出新风尚:兴改革之风 走转型之路',
			},
			{
				id:101,
				title:'巴萨砸了1亿多还有2笔巨购，继续猛追天使',
			},
			{
				id:102,
				title:'朝鲜导弹飞过日上空 特朗普与安倍同意对朝加压',
			},
			{
				id:103,
				title:'4分钟速览《大国外交》之《大道之行》',
			},
			{
				id:104,
				title:'杜兰特坚信詹姆斯明年留骑士 为此和名记打赌',
			},
			{
				id:105,
				title:'张翰毕业十周年与中戏师生聚会',
			},
			{
				id:106,
				title:'蒋欣晒照称暂时离开一下下',
			},
			{
				id:107,
				title:'人大常委会委员：建议私人场合歪唱国歌也追',
			},
		];
	  	let data = {
	  		has_next:false,
	  		totalPage:1,
	  		items:list,
	  	}

	  // let data = JSON.parse(rst);
      let dataArray = this.state.dataArray.concat(data.items);
      this.setState({dataArray:dataArray});
	  this.setState({totalPage:data.pages});
	  this.setState({isLoading:false});
	  if(this.state.page === 1)
	  	this.setState({loadSucc:true});

	  if(this.state.page > 1)
	  	this.setState({connected:true});

	  if(data.has_next){
		  let page = this.state.page;
		  page ++;
		  this.setState({page:page});
	  }
	  this.setState({hasMore:data.has_next});

	}
	_loadFail(){
		this.setState({isLoading:false});
	    if(this.state.loadSucc)  this.setState({connected:false});
	}

	_renderRow(rowData){
		return(
			<TouchableHighlight  style={styles.listItem} underlayColor='#f4f4f4' activeOpacity={0.9} onPress={()=>this._clickItem(rowData.id)} itemId={rowData.id} >
				<Text style={styles.titleStyle} numberOfLines={2}>{rowData.title}</Text>
			</TouchableHighlight>
		);
	}
	_loadMoreFunc(){
		if(this.state.isLoading) return;
		if(!this.state.hasMore) return;
		
		this.setState({isLoading:true});
		let param = {
	      page_num:this.state.page,
    	  per_page:20,
    	  type:this.props.value,
	    };
	    let url = this.state.from=='imageScreen'?reqUrls.imageList:reqUrls.textList;
	    requestMethod('GET',url, param).then(
	      (rst)=>{ this._loadSucc(rst); },
	      (msg)=>{ this._loadFail(); }
	    );
	}
	_footer(){
		if(!this.state.hasMore){
			return(<Text style={styles.footerStyle}>没有更多了</Text>);
		}else if(this.state.isLoading){
			return(<Text style={styles.footerStyle}>数据加载中...</Text>);
		}else if(!this.state.connected){
			return(<Text style={styles.footerStyle}>网络有点问题...</Text>);
		}else{
			return(<Text style={styles.footerStyle}>上拉加载</Text>);
		}
	}

	_clickItem(id){
		if (this.lastClicked && this.lastClicked + 1000 >= Date.now()) {
	    	return;
	    }
	    this.lastClicked = Date.now();
		
		

		let param = this.props;
		if(!param.isLoggedIn){
			this.props.navigation.navigate('Loginscrn');
			return;
		}

		requestMethod('PUT', reqUrls.deductGoldVideo,null,param.userInfo.loginToken,param.userInfo.user.id).then(
          (rst) => {
            this.props.navigation.navigate('Detail',{artId:id,from:this.state.from});
          },
          (msg) => {
          	Alert.alert('提示',msg,[{text:'确定'}]);
          }
        )
	}
	render() {
		if(this.state.loadSucc){
		    return (
		      <View>
			      <ListView
			      	style={styles.bgWhite}
			        dataSource={ds.cloneWithRows(this.state.dataArray)}
			        renderRow={this._renderRow}
			        enableEmptySections={true}
			        initialListSize={20}
			        onEndReached={this._loadMoreFunc}
			        onEndReachedThreshold={1}
			        renderFooter={this._footer}
			        contentContainerStyle={styles.containerStyle}
			      />
		      </View>
		    )
		}else if(this.state.isLoading){
			return (
				<View style={styles.container}>
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
		      	<View style={styles.container}>
			      <Image style={styles.wifiImg} source={require('../images/nowifi.png')} />
			      <Text style={styles.reloadText1}>网络状况不佳</Text>
			      <Text style={styles.reloadText2}>请检查您的网络设置</Text>
			      <TouchableHighlight underlayColor='#f4f4f4' activeOpacity={0.9} style={styles.reloadBtn}
			      	onPress = {() => {
			      	this.setState({isLoading:true});
			      	let param = {
				      page_num:1,
			    	  per_page:20,
			    	  type:this.props.value,
				    };
				    let url ;
				    if(this.state.from == 'textScreen') url = reqUrls.textList;
				    if(this.state.from == 'imageScreen') url = reqUrls.imageList;
				    requestMethod('GET',url, param).then(
				      (rst)=>{ this._loadSucc(rst); },
				      (msg)=>{ this._loadFail(); }
				    );
			      }}>
			      	<Text style={styles.reloadText}>重新加载</Text>
			      </TouchableHighlight>
		      	</View>
		    )
		}
	}
	
}
const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
  userInfo:state.auth.userInfo,
  routes: state.nav.routes,
  calculatorCode:state.cc.calculatorCode,
});
const mapDispatchToProps = dispatch => ({
  cacheCC: (calculatorCode) => dispatch({ type: 'cacheCC', calculatorCode: calculatorCode }),
  updateUserInfo: (userData) => dispatch({ type: 'Login', userData: userData}),
});

export default connect(mapStateToProps,mapDispatchToProps)(TextScreen);


//定义一些全局变量
const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');

const styles = StyleSheet.create({
	bgWhite:{
		backgroundColor:'#fff',
	},
	wifiImg:{
		width:120,
		height:100,
		marginBottom:10,
		marginLeft:(width-120)/2,
		marginTop:(height-340)/2,
	},
	reloadBtn:{
		width:160,
		height:30,
		marginTop:15,
		marginLeft:(width-160)/2,
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
		textAlign:'center',
	},
	reloadText2:{
		fontSize:12,
		color:'#999',
		textAlign:'center',
	},
	centering:{
		width:40,
		height:40,
		marginLeft:(width-40)/2,
		marginTop:(height-190)/2,
		transform:[{scale:2}],
		backgroundColor:'gray',
		borderRadius:5,
    },



	backgroundW:{
		backgroundColor:'#fff',
	},
	listItem:{
		paddingLeft:10,
		paddingRight:10,
		paddingTop:10,
		paddingBottom:10,
		borderBottomWidth:0.5,
		borderBottomColor:'#e2e2e2',
	},
	titleStyle:{
		fontSize:16,
		lineHeight:24,
		color:'#666',
		textAlign:'left',
	},
	footerStyle:{
		width:width,
		height:40,
		paddingTop:12.5,
		textAlign:'center',
		fontSize:12,
		color:'#999',
	},
	
});


