import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  Platform,
  Image,
  BackHandler,
  ToastAndroid ,
} from 'react-native';
import { connect } from 'react-redux';
import { TabNavigator, StackNavigator, addNavigationHelpers } from 'react-navigation';
import LoginScreen from './LoginScreen';
import DetailScreen from './DetailScreen';
import RegisterScreen from './RegisterScreen';
import MineScreen from './main/main_mine';
import RechargeScreen from './RechargeScreen';
import ExchangeScreen from './ExchangeScreen';
import SettingScreen from './SettingScreen';
import CollectScreen from './CollectScreen';
import UpdateInfoScreen from './UpdateInfoScreen';
import CalculatorScreen from './Calculator';
import NoticeScreen from './NoticeScreen';
import CalculatorCodeScreen from './CalculatorCode';
import VideoPlayerScreen from './video/VideoPlayer';
import ScrollTabCategory from './main/scroll_tab_category';



const MyVideoScreen = ({navigation}) => (
    <ScrollTabCategory navigation = {navigation}  category={'videoScreen'} />
);

MyVideoScreen.navigationOptions = {
  tabBarLabel: '新闻',
  tabBarIcon: ({ tintColor }) => (
    <Image
      source={require('./images/video.png')}
      style={[styles.icon, {tintColor: tintColor}]}
    />
  ),
  navigationOptions: ({navigation}) => ({
    title: ('${navigation.state.params.name}'+'s Profile'),
  }),
};

const MyImageScreen = ({navigation}) => (
    <ScrollTabCategory navigation = {navigation}  category={'imageScreen'} />
);
MyImageScreen.navigationOptions = {
    tabBarLabel: '新闻',
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('./images/image.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
};

const MyTextScreen = ({navigation}) => (
    <ScrollTabCategory navigation = {navigation}  category={'textScreen'} />
);
MyTextScreen.navigationOptions = {
    tabBarLabel: '新闻',
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('./images/text.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
};

const MyCenterScreen = ({ navigation }) => (
  <MineScreen navigation={navigation}/>
);
MyCenterScreen.navigationOptions = {
  tabBarLabel: '我',
  tabBarIcon: ({ tintColor }) => (
    <Image
      source={require('./images/center.png')}
      style={[styles.icon, {tintColor: tintColor}]}
    />
  ),
};

const styles = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
  },
  container:{
    marginTop:Platform.OS === 'ios' ? 20 : 0,
  }
});

const MainScreen = TabNavigator({
  Text: {
    screen: MyTextScreen,
    path: '',
  },
  Image: {
    screen: MyImageScreen,
    path: '',
  },
  Video: {
    screen: MyVideoScreen,
    path: '',
  },
  Mine: {
    screen: MyCenterScreen,
    path: 'userCenter',
  },
}, {
  tabBarOptions: {
    activeTintColor: '#4285f4',
    inactiveTintColor:'#999',
    labelStyle:{
      fontSize: 10,
      margin:0,
      marginTop:4,
      marginBottom:4,
    },
    style:{
      backgroundColor:'rgba(249, 249, 249, 0.8)',
    },
    indicatorStyle:{
      backgroundColor:'#05A5D1',
      height:0,
    },
  	showIcon:true,
  	tabStyle:{
  		padding:0,
  		height:50,
  	}
  },
  swipeEnabled: false,
  tabBarPosition:'bottom',
  lazy:true,
});

MainScreen.navigationOptions = {
  header:null,
	title:'首页',
  headerStyle:{
    backgroundColor:'#fff',
  },
  headerTitleStyle:{
    textAlign:'center',
    alignSelf:'center',
  },
}


export const AppNavigator = StackNavigator({
  Loginscrn: { screen: LoginScreen },
  Main: { screen: MainScreen },
  Detail: { screen: DetailScreen },
  Register: { screen: RegisterScreen},
  Recharge:{screen:RechargeScreen},
  Exchange:{screen:ExchangeScreen},
  Collect:{screen:CollectScreen},
  Setting:{screen:SettingScreen},
  UpdateInfo:{screen:UpdateInfoScreen},
  Calculator:{screen:CalculatorScreen},
  Notice:{screen:NoticeScreen},
  CalculatorCode:{screen:CalculatorCodeScreen},
  VideoPlayer: {screen: VideoPlayerScreen}
},{
  initialRouteName:'Main',
  mode:'modal',
  headerMode:'screen',
});


const AppWithNavigationState = ({ dispatch, nav }) => (
  <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
);

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);




