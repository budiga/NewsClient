
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
	Alert,
	ActivityIndicator,
	AppState,
	BackHandler,
	ToastAndroid,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Dimensions from 'Dimensions';
import { connect } from 'react-redux';

import Storage from '../../util/Storage';
import { requestMethod } from '../../util/RequestClass';
import { reqUrls } from '../../util/RequestUrls';


const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
class VideoScreen extends Component{
	constructor(props) {
	    super(props);
	    this.state = {
	    	value:this.props.value,
	      dataArray:[],
	      page:1,
	      totalPage:0,
	      isLoading:true,//是否正在加载
	      animating: true,
	      loadSucc:false,//是否已成功加载过一次数据
	      connected:true,//是否断网了
	      hasMore:false,
	      appState: AppState.currentState,
	    };
	    this._renderRow = this._renderRow.bind(this);
	    this._loadMoreFunc = this._loadMoreFunc.bind(this);
	    this._footer = this._footer.bind(this);
	    this._clickItem = this._clickItem.bind(this);
	    this._loadSucc = this._loadSucc.bind(this);
	    this._loadFail = this._loadFail.bind(this);

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
		if (Platform.OS === 'android') {
			BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
		}
	}
	componentDidMount(){
	    // let param = {
	    //   page_num:this.state.page,
    	//   per_page:12,
    	//   type:this.props.value,
	    // };
	    // requestMethod('GET',reqUrls.videoList, param).then(
	    //   (rst)=>{
	    //     this._loadSucc(rst);
	    //   },
	    //   (msg)=>{ this._loadFail(); }
	    // );

		this._loadSucc();
	}

	_loadSucc(rst){
		let list = [
			{
				id:100,
				title:'全运会“变”',
				url:'../images/mf.jpeg',
			},
			{
				id:101,
				title:'巴萨砸了1亿',
				url:'../images/mf.jpeg',
			},
			{
				id:102,
				title:'朝鲜导弹',
			},
			{
				id:103,
				title:'4分钟速',
			},
			{
				id:104,
				title:'杜兰特坚信詹姆斯',
			},
			{
				id:105,
				title:'张翰毕业十周年',
			},
			{
				id:106,
				title:'蒋欣晒照称',
			},
			{
				id:107,
				title:'歪唱国歌也追',
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
		// let coverUrl = rowData.sha1? rowData.sha1:rowData.cover;
		return(
			<TouchableHighlight style={styles.listItem} underlayColor='#f4f4f4' activeOpacity={0.9} onPress={()=>this._clickItem(rowData.id)} itemId={rowData.id} >
				<View style={styles.listItemView}>
					<Image style={styles.listItemImage} resizeMode={'cover'} source={require('../images/zq.jpg')} />
					<Text style={styles.listItemText} numberOfLines={1}>{rowData.title}</Text>
				</View>
			</TouchableHighlight>
		);
	}
	_loadMoreFunc(){
		if(this.state.isLoading) return;
		if(!this.state.hasMore) return;
		
		this.setState({isLoading:true});
		let param = {
	      page_num:this.state.page,
    	  per_page:12,
    	  type:this.props.value,
	    };
	    requestMethod('GET',reqUrls.videoList, param).then(
	      (rst)=>{
	        this._loadSucc(rst);
	      },
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
		if(!this.props.isLoggedIn){
			this.props.navigation.navigate('Loginscrn');
			return;
		}

        this.props.navigation.navigate('Detail',{artId:id,from:'videoScreen'});
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
			        initialListSize={12}
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
			    	  per_page:12,
			    	  type:this.props.value,
				    };
				    requestMethod('GET',reqUrls.videoList, param).then(
				      (rst)=>{
				        this._loadSucc(rst);
				      },
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
});

export default connect(mapStateToProps)(VideoScreen);

//定义一些全局变量
const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');
 
const cols = 3;
const boxH = 170;
const wMargin = 10;

const boxW = (width - (cols+1) * wMargin) / cols;
const hMargin = 5;

const styles = StyleSheet.create({
	wifiImg:{
		width:120,
		height:100,
		marginLeft:(width-120)/2,
		marginTop:(height-340)/2,
		marginBottom:10,
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


	bgWhite:{
		backgroundColor:'#fff',
	},
	containerStyle:{
		flexDirection:'row',
		flexWrap:'wrap',
		alignItems:'center',
	},
	listItem:{
		width:boxW,  
        height:boxH,
        marginLeft:wMargin,  
        marginTop:hMargin,
	},
	listItemView:{
		width:boxW,  
        height:boxH,
		flexDirection:'column',
		justifyContent: 'flex-start',
	    alignItems: 'center',
	},
	listItemImage:{
		width:boxW,
		height:145,
		marginBottom:5,
		backgroundColor:'#f7f7f7',
	},
	listItemText:{
		fontSize:16,
		lineHeight:20,
		color:'#666',
		textAlign:'center',
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
