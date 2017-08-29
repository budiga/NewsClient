import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';
import {
  AsyncStorage,
} from 'react-native';

import { AppNavigator } from '../components/MainScreen';
import Storage from '../util/Storage';

const firstAction = AppNavigator.router.getActionForPathAndParams('Main');
const initialNavState = AppNavigator.router.getStateForAction(firstAction.action);

function nav(state = initialNavState, action) {
  let nextState;
  switch (action.type) {
    default:
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }

  return nextState || state;
}


const initialAuthState = { isLoggedIn: false, userInfo: {}};

function auth(state = initialAuthState, action) {
  let newState;
  switch (action.type) {
    case 'Login':
      Storage.setItem('userInfo',JSON.stringify(action.userData));
      return { userInfo:action.userData, isLoggedIn: true };
    case 'Logout':
      Storage.delete('userInfo');
      return { userInfo:{}, isLoggedIn: false };
    case 'updateDeadline':
      state.userInfo.user.deadline = action.deadline;
      newState = Object.assign({}, state);
      Storage.setItem('userInfo',JSON.stringify(state.userInfo));
      return newState;
    case 'updateVersion':
      state.userInfo.user.version = action.version;
      newState = Object.assign({}, state);
      Storage.setItem('userInfo',JSON.stringify(state.userInfo));
      return newState;
    case 'updateEmail':
      state.userInfo.user.email = action.email;
      newState = Object.assign({}, state);
      Storage.setItem('userInfo',JSON.stringify(state.userInfo));
      return newState;
    default:
      return state;
  }
}

const initialCodeState = {calculatorCode:null};
function cc(state = initialCodeState,action){
  switch(action.type){
    case 'cacheCC':
      return {calculatorCode:action.calculatorCode};
    default:
      return state;
  }
}

const AppReducer = combineReducers({
	nav,
  auth,
  cc,
});

export default AppReducer;
