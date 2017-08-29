import React, { Component } from 'react';
import {
  AppRegistry,Button,
  StyleSheet,TouchableHighlight,
  Text,
  View,
  BackHandler,
  ToastAndroid,
  Platform,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Storage from '../util/Storage';

class Calculator extends Component {

  constructor(props) {
    super(props)
    this.state = { 
      show: '',
      calculateCode:'777799998888',
      };
    this.v1 = 0;
    this.operator = null;
    this.reset = false;
  }
  static navigationOptions = ({navigation}) => {
    return{
      title: '计算器',
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
      headerLeft:<View/>,
    }
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

  componentDidMount(){
    Storage.getItem('calculatorCode').then((rst)=>{
      if(rst){
        this.setState({calculateCode:rst});
      }
    });
  }
  //////Perform operations on Tapping
  onTaping(value) {
    const result = this.reset ? '' : this.state.show;
    this.reset = false;
    this.setState({ show: result+ '' +value });

    let userInput = '' + this.state.show + value;
    if(userInput == this.state.calculateCode){
      this.props.navigation.goBack();
    }
  }

  calculate(operator) {
    if (this.operator && !this.reset) {
      let result = 0;
      switch (this.operator) {
        case '+': result = Number(this.v1) + Number(this.state.show); break;
        case '-': result = Number(this.v1) - Number(this.state.show); break;
        case '*': result = Number(this.v1) * Number(this.state.show); break;
        case '/': result = Number(this.v1) / Number(this.state.show); break;
        break;
      }
      this.operator = operator;
      this.v1 = result;
      this.reset = true;
      this.setState({ show: ''+result });
      if(operator === '='){
        this.operator = 0;
      }
    } else {
      this.operator = operator;
      this.v1 = this.reset ? this.v1 : this.state.show;
      this.reset = true;
    }
  }

  enterTapped(enterVal) {
    this.setState({value1: eval(''+this.state.value1+this.state.operatorValue+this.state.value2)});
  }

  //////To create button
  renderButton(value){
    const onPress = () => this.onTaping(value);
    return this.renderElement(value, onPress);
  }

  //To create Cancel button
  renderCancel (value){
    const onPress = () => this.onPressingCancelBtn(value);
    return this.renderElement(value, onPress, {backgroundColor: 'rgba(224,224,224,1)'}, {color: 'black', fontSize: 30,});
  }

  //////To create operator
  renderOperator(operator){
    const onPress = () => this.calculate(operator);
    return this.renderElement(operator, onPress, {backgroundColor: 'orange'}, {color: 'white', fontWeight: '400', fontSize: 35,});
  }

  renderElement(value, onPress, style = null, textStyle= null) {
    return (
      <TouchableHighlight
        style={[styles.instructions, style]}
        onPress={onPress}
        activeOpacity= {0.5}
        underlayColor= 'darkgray'
      >
        <Text style={[styles.welcome, textStyle]}>
          {value}
        </Text>
      </TouchableHighlight>
    )
  }

  onPressingCancelBtn(value){
    this.setState({ show: 0 });
    this.v1 = 0;
    this.operator = 0;
    this.reset = true;
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flex:1, backgroundColor:'black',justifyContent:'flex-end'}}>
            <Text style = {{textAlign: 'right', fontSize:35, color: 'white'}}>{this.state.show}</Text>
        </View>
        <View style={{flex:2, justifyContent:'space-around',flexWrap:'wrap',backgroundColor: '#193441'}}>
          <View style={styles.rows}>
            {this.renderButton(7)}
            {this.renderButton(8)}
            {this.renderButton(9)}
            {this.renderOperator('*')}
          </View>
          <View style={styles.rows}>
            {this.renderButton(4)}
            {this.renderButton(5)}
            {this.renderButton(6)}
            {this.renderOperator('-')}
          </View>
          <View style={styles.rows}>
            {this.renderButton(1)}
            {this.renderButton(2)}
            {this.renderButton(3)}
            {this.renderOperator('+')}
          </View>
          <View style={styles.rows}>
            {!this.props.hideCButton && this.renderCancel('C')}
            {this.renderButton(0)}
            {this.renderButton('.')}
            {this.renderOperator('=')}
          </View>
        </View>
      </View>
    );
  }

}

export default Calculator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    color:'black',
    fontWeight: '500'
  },
  instructions: {
    flex:1,
    justifyContent: 'center',
    backgroundColor: 'rgba(224,224,224,1)',
    borderWidth: 0.5,
    borderColor: 'black'
  },
  rows: {
    flex:1,
    flexDirection:'row',
    justifyContent:'space-around',
    flexWrap:'wrap'
  },
});