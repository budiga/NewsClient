import React,{Component} from 'react';
import {
    Text,
    TouchableHighlight,
    Platform,
    StyleSheet,
    ActivityIndicator,
    View,
} from 'react-native';
import Dimensions from 'Dimensions';
import TimerMixin from 'react-timer-mixin';
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import VideoScreen from './main_video';
import TextScreen from './main_text';
import { requestMethod } from '../../util/RequestClass';
import { reqUrls } from '../../util/RequestUrls';
import Storage from '../../util/Storage';

const Child = React.createClass({
    onEnter() {
        console.log('enter: ' + this.props.i); // eslint-disable-line no-console
    },

    onLeave() {
        console.log('leave: ' + this.props.i); // eslint-disable-line no-console
    },

    render() {
        const value = this.props.value;
        let category = this.props.category;
        if(category == 'videoScreen'){
            return <VideoScreen navigation={this.props.navigation} value={value} />;
        }else{
            return <TextScreen navigation={this.props.navigation} value={value} category={category} />;
        }

    },
});

export default  React.createClass ({
    mixins: [TimerMixin, ],
    children: [],
    scrollableTabView: {},

    getInitialState() {
        return {
            tabs: [
                {name:'',value:1,}
            ],
            category:this.props.category,
            categoryLoaded:false,
        };
    },

    componentWillMount(){
        if(this.props.category == 'textScreen'){
            Storage.getItem('calculatorCode').then((rst)=>{
                if(rst){
                    this.props.navigation.navigate('Calculator');
                }
            });
        }
        // requestMethod('GET',reqUrls.typeList, param).then(
        //   (rst)=>{
        //     this.setState({categoryLoaded:true});
        //     let tabs = JSON.parse(rst);
        //     let that = this;
        //     that.setState({tabs:tabs});
        //   },
        //   (msg)=>{
        //     this.setState({tabs:[{name:'动态',value:1}]});
        //   }
        // );
        let list = [
            {
                name:'头条',
                value:1,
            },
            {
                name:'国内',
                value:1,
            },
            {
                name:'奇闻逸事',
                value:1,
            },
            {
                name:'体育',
                value:1,
            },
            {
                name:'娱乐',
                value:1,
            },
            {
                name:'搞笑综合',
                value:1,
            },
            {
                name:'最新动态',
                value:1,
            },
            {
                name:'图片',
                value:1,
            },
            {
                name:'其他',
                value:1,
            },
        ];
        let that = this;
        setTimeout(function(){
            that.setState({categoryLoaded:true});
            that.setState({tabs:list});
        },300);
    },

    //调用类别api接口返回分类数据
    componentDidMount() {

    },

    handleChangeTab({i, ref, from, }) {
    },


    render() {
        var navigation = this.props.navigation;
        var category  = this.props.category;
        let num = (Platform.OS == 'android')?0:0;
        if(this.state.categoryLoaded){
            return <ScrollableTabView
                style={{paddingTop: num, }}
                renderTabBar={() => <ScrollableTabBar activeTextColor={'#fff'} inactiveTextColor={'#bfcade'} backgroundColor={'#4285f4'}/>}
                onChangeTab={this.handleChangeTab}
                ref={(ref) => (this.scrollableTabView = ref)}
            >
                {this.state.tabs.map((tab, i) => {
                    return <Child
                        ref={(ref) => (this.children[i] = ref)}
                        tabLabel={tab.name}
                        value={tab.value}
                        navigation={navigation}
                        category={category}
                        key={'childScreen_'+i}
                    />;
                })}
            </ScrollableTabView>;
        }else{
            return <View style={styles.container}>
                <ActivityIndicator
                  animating={this.state.animating}
                  style={styles.centering}
                  size= 'small'
                  color= '#fff'
                />
            </View>
        }
    },
});


const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');
const styles = StyleSheet.create({
    centering:{
        width:40,
        height:40,
        marginLeft:(width-40)/2,
        marginTop:(height-190)/2,
        transform:[{scale:2}],
        backgroundColor:'gray',
        borderRadius:5,
    },
})

