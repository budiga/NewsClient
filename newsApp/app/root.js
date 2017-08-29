import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { BackHandler, Platform, ToastAndroid } from 'react-native';

import AppReducer from './src/reducers/AppReducer';
import AppWithNavigationState from './src/components/MainScreen';


class Root extends React.Component{
  constructor() {
		super();
	}

	store = createStore(AppReducer);

	render() {
		return (
			<Provider store = { this.store }>
		  		<AppWithNavigationState />
		  </Provider>
		)
	}

}
export default Root;
