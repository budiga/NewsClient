
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
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Dimensions from 'Dimensions';
import { connect } from 'react-redux';

import { requestMethod } from '../util/RequestClass';
import { reqUrls } from '../util/RequestUrls';


const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
class CollectScreen extends Component{
	static navigationOptions = {
	    title: '收藏',
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
	      page:1,
	      totalPage:0,
	      isLoading:true,
	      animating: true,
	      loadSucc:false,
	      connected:true,
	    };
	    this._renderRow = this._renderRow.bind(this);
	    this._loadMoreFunc = this._loadMoreFunc.bind(this);
	    this._footer = this._footer.bind(this);
	    this._clickItem = this._clickItem.bind(this);
	    this._loadSucc = this._loadSucc.bind(this);
	    this._loadFail = this._loadFail.bind(this);

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
	    // let param = {
	    //   page_num:this.state.page,
    	//   per_page:20,
	    // };
	    // requestMethod('GET',reqUrls.collect, param, this.props.userInfo.loginToken, this.props.userInfo.user.id).then(
	    //   (rst)=>{ this._loadSucc(rst); },
	    //   (msg)=>{ this._loadFail(msg); }
	    // );
	    this._loadSucc();
	}

	_loadSucc(rst){
		let data = {
			items:[],
			pages:0,

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

	  let page = this.state.page;
	  page ++;
	  this.setState({page:page});
	}
	_loadFail(msg){
		this.setState({isLoading:false});
	    if(this.state.loadSucc)  this.setState({connected:false});

	    Alert.alert('提示',msg,[{text:'确定'}]);
	}

	_renderRow(rowData){
		let typeStr;
		if(rowData.item_type == 1) typeStr = '【图片】';
		if(rowData.item_type == 2) typeStr = '【小说】';
		if(rowData.item_type == 3) typeStr = '【视频】';

		return(
			<TouchableHighlight  style={styles.listItem} underlayColor='#f4f4f4' activeOpacity={0.9} onPress={()=>this._clickItem(rowData.item_type,rowData.item_id)} data-id={rowData.id} >
				<Text style={styles.titleStyle} numberOfLines={2}>{typeStr+rowData.mark}</Text>
			</TouchableHighlight>
		);
	}
	_loadMoreFunc(){
		if(this.state.isLoading) return;
		if(this.state.page >= this.state.totalPage) return;
		
		this.setState({isLoading:true});
		let param = {
	      page_num:this.state.page,
    	  per_page:20,
	    };
	    requestMethod('GET',reqUrls.collect, param, this.props.userInfo.loginToken, this.props.userInfo.user.id).then(
	      (rst)=>{ this._loadSucc(rst); },
	      (msg)=>{ this._loadFail(msg); }
	    );
	}
	_footer(){
		if(this.state.dataArray.length == 0){
			return(<Text style={styles.footerStyle}>您还没有收藏哦</Text>);
		}else if(this.state.page >= this.state.totalPage){
			return(<Text style={styles.footerStyle}>没有更多收藏</Text>);
		}else if(this.state.isLoading){
			return(<Text style={styles.footerStyle}>数据加载中...</Text>);
		}else if(!this.state.connected){
			return(<Text style={styles.footerStyle}>网络有点问题...</Text>);
		}else{
			return(<Text style={styles.footerStyle}>上拉加载</Text>);
		}
	}
	_clickItem(type,id){
		let from;
		if(type == 1) from = 'imageScreen';
		if(type == 2) from = 'textScreen';
		if(type == 3) from = 'videoScreen';

		this.props.navigation.navigate('Detail',{artId:id,from:from,isVisited:true});
		return;
	}
	render() {
		if(this.state.loadSucc ){
		    return (
		      <View>
			      <ListView
			      	style={styles.bgWhite}
			        dataSource={ds.cloneWithRows(this.state.dataArray)}
			        renderRow={this._renderRow}
			        initialListSize={20}
			        enableEmptySections={true}
			        onEndReached={this._loadMoreFunc}
			        onEndReachedThreshold={1}
			        renderFooter={this._footer}
			        contentContainerStyle={styles.containerStyle}
			      />
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
			      	let param = {
				      page_num:this.state.page,
			    	  per_page:20,
				    };
				    requestMethod('GET',reqUrls.collect, param, this.props.userInfo.loginToken, this.props.userInfo.user.id).then(
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

export default connect(mapStateToProps)(CollectScreen);


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

	bgWhite:{
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
		height:40,
		paddingTop:12.5,
		textAlign:'center',
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
});


