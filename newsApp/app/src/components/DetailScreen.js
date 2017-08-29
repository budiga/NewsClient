import React from 'react';
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
  ToastAndroid,
  Clipboard,
  Modal,
  BackHandler,
}from 'react-native';
import { NavigationActions } from 'react-navigation';
import Dimensions from 'Dimensions';
import { connect } from 'react-redux';

import Storage from '../util/Storage';
import { requestMethod,timeFormat } from '../util/RequestClass';
import { reqUrls } from '../util/RequestUrls';
import {
    LazyloadScrollView,
    LazyloadImage
} from 'react-native-lazyload';
import Gallery from 'react-native-gallery';


import PluginModule from '../util/Plugins';


class DetailScreen extends React.Component {
  static navigationOptions = {
    title: '详情',
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
  constructor(props){
    super(props);
    this.state = {
      artId:this.props.navigation.state.params.artId,
      from:this.props.navigation.state.params.from,
      isLoading:true,
      loadSucc:false,
      animating: true,
      article:null,
      foucsed:false,
      praised:false,
      praiseNum:0,
      modalVisible:false,
      lowImageList:null,
      moduleList:null,
      initialPage:0,
    };

    this._loadArticle = this._loadArticle.bind(this);
    this._loadSucc = this._loadSucc.bind(this);
    this._loadFail = this._loadFail.bind(this);
    this._foucs = this._foucs.bind(this);
    this._praise = this._praise.bind(this);
    this._artContent = this._artContent.bind(this);
    this._checkFoucs = this._checkFoucs.bind(this);
    this._copyToClipboard = this._copyToClipboard.bind(this);
    this._forModule = this._forModule.bind(this);
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
    this._loadArticle();
    this._checkFoucs();
  }
  _loadArticle(){
    let from = this.state.from;
    let userInfo = this.props.userInfo;
    let param = {item_id:this.state.artId};

    if(from === 'videoScreen'){
      requestMethod('GET', reqUrls.itemVideo,param,userInfo.loginToken,userInfo.user.id).then(
        (rst)=>{ this._loadSucc(rst); },
        (msg)=>{ this._loadFail(msg); }
      );
    }

     if(from === 'imageScreen'){
      requestMethod('GET', reqUrls.itemImage,param,userInfo.loginToken,userInfo.user.id).then(
        (rst)=>{ this._loadSucc(rst); },
        (msg)=>{ this._loadFail(msg); }
      );
    }

     if(from === 'textScreen'){
      requestMethod('GET', reqUrls.itemText,param,userInfo.loginToken,userInfo.user.id).then(
        (rst)=>{ this._loadSucc(rst); },
        (msg)=>{ this._loadFail(msg); }
      );
    }
  }

  _loadSucc(result){
    if(!result) return;
    let article = JSON.parse(result);
    this.setState({article:article});
    if(this.state.from=='imageScreen') this._forModule();
    this.setState({loadSucc:true});
    this.setState({isLoading:false});
    this.setState({praiseNum:article.praise});
  }
  _loadFail(message){
    Alert.alert('提示',message,[{text:'确定',onPress:()=>{}}]);
    this.setState({loadSucc:false});
    this.setState({isLoading:false});
  }

  _forModule(){
    let urlsList = this.state.article.srcs;
    let moduleList = [],lowImageList = [];//lowImageList为低质量图片，moduleList为大图
    for(let i=0,len=urlsList.length;i<len;i++){
      let item = urlsList[i];
      if(item.small){
        lowImageList.push(item.small);
      }else{
        lowImageList.push(item.url);
      }
      if(item.full){
        moduleList.push(item.full);
      }else{
        moduleList.push(item.url);
      }
    }
    this.setState({moduleList:moduleList,lowImageList:lowImageList});

    // setTimeout(function(){//延迟3s，再将大图预加载到缓存中
    //   moduleList.forEach(function(ele){
    //     Image.prefetch(ele);
    //   });
    // },3000);
  }
  _checkFoucs(){
    let type ;
    if(this.state.from === 'videoScreen') type = 3;
    else if(this.state.from === 'imageScreen') type = 1;
    else  type = 2;

    let param = { item_id:this.state.artId, item_type:type};
    requestMethod('GET',reqUrls.foucs, param, this.props.userInfo.loginToken, this.props.userInfo.user.id).then(
      (rst)=>{
        if(rst == '1')
          this.setState({foucsed:true});
      }
    );
  }
  _foucs(){
    let type ;
    if(this.state.from === 'videoScreen') type = 3;
    else if(this.state.from === 'imageScreen') type = 1;
    else  type = 2;

    let param = { item_id:this.state.artId, item_type:type};
    let method ;
    if(this.state.foucsed){
      method = 'DELETE';
    }else{
      method = 'POST';
      param.mark = this.state.article.title;
    }

    requestMethod(method,reqUrls.foucs, param, this.props.userInfo.loginToken, this.props.userInfo.user.id).then(
      (rst)=>{
        this.setState({foucsed:!this.state.foucsed});
      },
      (msg)=>{
        Alert.alert('提示','操作失败，稍后再试',[{text:'确定'}]);
      },
    );
  }
  _praise(){
    if(this.state.praised) return;//点赞过 不再点

    let url ;
    if(this.state.from === 'videoScreen'){
      url = reqUrls.praiseVideo;
    }else if(this.state.from === 'imageScreen'){
      url = reqUrls.praiseImage;
    }else{
      url = reqUrls.praiseText;
    }

    url += '?item_id='+this.state.artId;
    requestMethod('PUT',url, null, this.props.userInfo.loginToken, this.props.userInfo.user.id).then(
      (rst)=>{
        this.setState({praiseNum:rst});
        this.setState({praised:true});
      },
      (msg)=>{  Alert.alert('提示',msg,[{text:'确定',onPress:()=>{}}]);},
    );
  }

  _copyToClipboard(){
    if(!this.props.userInfo.user.prime){
      Alert.alert('提示','会员才能获取下载链接哦，快去成为会员吧！',[{text:'确定',onPress:()=>{this.props.navigation.navigate('Recharge',{title:'会员充值',reType:'member'});}}]);
      return;
    }

    Clipboard.setString(this.state.article.url);

    if (Platform.OS === 'android'){
        ToastAndroid.show('复制成功！', ToastAndroid.SHORT);
    }else{
      Alert.alert('提示','复制成功！',[{text:'确定'}]);
    }

    // if (Platform.OS === 'android'){
    //     PluginModule.callThunderWithUrl(this.state.article.url);
    // }else{
    //   Alert.alert('提示','复制成功！',[{text:'确定'}]);
    // }

  }

  _artContent(){
    if(this.state.from === 'videoScreen'){
      let coverUri = this.state.article.sha1? this.state.article.sha1:this.state.article.cover;
      return <View style={styles.artContent}>
          <View style={styles.imgContainer}>
            <Image style={styles.videoScreenImg} source={{uri:coverUri}} />
          </View>
          <Text style={styles.downloadText}>下载说明：</Text>
          <Text style={styles.downloadText}>1、建议使用迅雷软件下载影片（安卓手机可以去应用市场下载手机版迅雷）</Text>
          <Text style={styles.downloadText}>2、点击下方按钮，复制下载链接</Text>
          <Text style={styles.downloadText}>3、会员用户才能复制下载链接</Text>
          <View style={styles.cashButtonArea}>
            <TouchableHighlight style={styles.cashButton} underlayColor='#f9f9f9' activeOpacity={0.9}
            onPress={this._copyToClipboard}>
              <Text style={styles.cashButtonText}>复制下载链接</Text>
            </TouchableHighlight>
          </View>
        </View>
    }

    if(this.state.from === 'imageScreen'){
      let artId = this.state.article.id ;
      let srcs = this.state.lowImageList;
      let width = Dimensions.get('window').width;
      let list = [];
      for(let i=0;i < srcs.length;i++){
        let keystr = artId+'img-'+i;
        list.push(<TouchableHighlight  underlayColor='#f4f4f4' activeOpacity={0.9} key={keystr} onPress={()=> {
          this.setState({initialPage:i});
          this.setState({modalVisible:true});
        }}>
            <LazyloadImage
                host="imagesScroll"
                style={[styles.avatarImage,{height:300}]}
                source={{uri:srcs[i]}}
                animation={false}
            />
          </TouchableHighlight>);
      }
      return (
      <View>
        <LazyloadScrollView style={styles.container} contentContainerStyle={styles.content} name="imagesScroll">
          <View style={styles.artHead}>
            <Text style={styles.artTitle} numberOfLines={1}>{this.state.article.title}</Text>
            <Text style={styles.artTime}>{timeFormat(this.state.article.create_time)}</Text>
            <TouchableHighlight style={styles.collectBtn} underlayColor='#f4f4f4' activeOpacity={0.9} onPress={this._foucs}>
              <View style={styles.collectBtnView}>
                <Image style={styles.collectBtnImg} source={this.state.foucsed?(require('./images/gz.png')):(require('./images/gzno.png'))}/>
                <Text style={styles.collectBtnText}>{this.state.foucsed?'已收藏':'收藏'}</Text>
              </View>
            </TouchableHighlight>
          </View>
          {list}
          <View style={styles.likeAndTip}>
            <TouchableHighlight style={styles.like} underlayColor='#f4f4f4' activeOpacity={0.9} onPress={this._praise}>
              <View style={styles.likeInnerView}>
                <Text  style={styles.likeText}>{this.state.praiseNum}</Text>
                <Image style={styles.praiseImgStyle} source={this.state.praised?require('./images/praise.png'):require('./images/nopraise.png')}/>
              </View>
            </TouchableHighlight>
          </View>
        </LazyloadScrollView>
        <Modal
          animationType={"none"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {this.setState({modalVisible:false});}}
          >
          <View style={{width:width,height:height}}>
            <View style={styles.pageIndicator}><Text style={styles.pageIndicatorText}>{(this.state.initialPage+1)+'/'+this.state.article.srcs.length}</Text></View>
            <Gallery
                style={{width:width,height:height-300,flex: 1, backgroundColor: 'black'}}
                onSingleTapConfirmed={()=>{
                  this.setState({modalVisible:false});
                }}
                onPageSelected={(index)=>{
                  this.setState({initialPage:index});
                }}
                images={this.state.moduleList}
                initialPage={this.state.initialPage}
                pageMargin={10}
              />
          </View>
        </Modal>
      </View>
      );
    }

    if(this.state.from === 'textScreen'){
      return <View style={[styles.artContent,{paddingHorizontal:10}]}>
              <Text style={styles.textStyle}>{this.state.article.content}</Text>
            </View>
    }

  }
  render() {
    if(this.state.isLoading){
      return (
        <View>
          <ActivityIndicator
            animating={this.state.animating}
            style={styles.centering}
            size= 'small'
            color= '#fff'
          />
        </View>
      );
    }else if(this.state.loadSucc){
      if(this.state.from == 'imageScreen'){
        return(
          <View>
          {this._artContent()}
          </View>
        );
      }else{
        return (
          <ScrollView style={styles.bgColorWhite}>
            <View style={styles.artHead}>
              <Text style={styles.artTitle} numberOfLines={1}>{this.state.article.title}</Text>
              <Text style={styles.artTime}>{timeFormat(this.state.article.create_time)}</Text>
              <TouchableHighlight style={styles.collectBtn} underlayColor='#f4f4f4' activeOpacity={0.9} onPress={this._foucs}>
                <View style={styles.collectBtnView}>
                  <Image style={styles.collectBtnImg} source={this.state.foucsed?(require('./images/gz.png')):(require('./images/gzno.png'))}/>
                  <Text style={styles.collectBtnText}>{this.state.foucsed?'已收藏':'收藏'}</Text>
                </View>
              </TouchableHighlight>
            </View>
            {this._artContent()}
            <View style={styles.likeAndTip}>
              <TouchableHighlight style={styles.like} underlayColor='#f4f4f4' activeOpacity={0.9} onPress={this._praise}>
                <View style={styles.likeInnerView}>
                  <Text  style={styles.likeText}>{this.state.praiseNum}</Text>
                  <Image style={styles.praiseImgStyle} source={this.state.praised?require('./images/praise.png'):require('./images/nopraise.png')}/>
                </View>
              </TouchableHighlight>
            </View>
          </ScrollView>
        )
      }
    }else if(!this.state.loadSucc){
      return (
          <View>
            <View style={styles.noWifiWrapper}>
            <Image style={styles.wifiImg} source={require('./images/nowifi.png')} />
            <Text style={styles.reloadText1}>网络状况不佳</Text>
            <Text style={styles.reloadText2}>请检查您的网络设置</Text>
            <TouchableHighlight underlayColor='#f4f4f4' activeOpacity={0.9} style={styles.reloadBtn}
              onPress = {() => {
              this.setState({isLoading:true});
              this._loadArticle();
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

export default connect(mapStateToProps)(DetailScreen);

//定义一些全局变量
const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');
const styles = StyleSheet.create({
  bgColorWhite:{
    backgroundColor:'#f9f9f9',
  },
  artHead:{
    width:width,
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'flex-start',
    paddingHorizontal:20,
    paddingVertical:10,
    borderBottomWidth:0.5,
    borderBottomColor:'#e2e2e2',
    backgroundColor:'#fff',
  },
  artTitle:{
    fontSize:18,
    lineHeight:30,
    color:'#333',
    marginBottom:10,
  },
  artTime:{
    fontSize:14,
    lineHeight:14,
    color:'#999',
  },
  collectBtn:{
    position:'absolute',
    right:20,
    bottom:6,
    paddingVertical:3,
    paddingHorizontal:10,
    borderWidth:0.5,
    borderColor:'#666',
    borderRadius:3,
  },
  collectBtnView:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
  },
  collectBtnImg:{
    width:14,
    height:14,
    marginRight:5,
  },
  collectBtnText:{
    fontSize:12,
    color:'#999',
  },
  artContent:{
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'flex-start',
    marginBottom:10,
  },
  likeAndTip:{
    height:120,
    width:width,
    paddingBottom:30,
    paddingTop:5,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
  },
 like:{
    height:60,
    width:60,
    borderWidth:1,
    borderColor:'#e2e2e2',
    borderRadius:30,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
  },
  likeInnerView:{
    height:30,
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center',
  },
  likeText:{
    fontSize:12,
    color:'#666',
    marginRight:5,
  },
  praiseImgStyle:{
    height:16,
    width:16,
  },
  tipImgStyle:{
    height:40,
    width:40,
  },


  imgContainer:{
    width:width - 20,
    height:325,
    paddingTop:5,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
  },
  videoScreenImg:{
    width:240,
    height:320,
  },
  downloadText:{
    marginTop:5,
    marginLeft:20,
    marginRight:20,
    fontSize:14,
    color:'#999',
  },
  imageScreenImg:{
    width:width - 20,
    height:200,
    marginBottom:5,
    resizeMode:'contain',
  },
  textStyle:{
    fontSize:18,
    lineHeight:30,
    color:'#666',
    textAlign:'justify',
  },


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

  cashButtonArea:{
    marginTop:10,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cashButton:{
    height:40,
    width:width-40,
    marginLeft:20,
    borderRadius:8,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth:1,
    borderColor:'#4285f4',
  },
  cashButtonText:{
    color:'#4285f4',
    fontSize:14,
  },


  container:{
    width:width,
    height:height,
  },
  content:{
    paddingBottom:70,
    flexDirection:'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#fff',
  },
  avatarImage: {
    width: width-40,
    marginTop: 10,
    resizeMode: 'cover',
    backgroundColor:'#f7f7f7',
  },
  pageIndicator:{
    position:'absolute',
    top:20,
    right:20,
    zIndex:500,
  },
  pageIndicatorText:{
    fontSize:16,
    color:'#fff',
    backgroundColor:'transparent',
  },

});

