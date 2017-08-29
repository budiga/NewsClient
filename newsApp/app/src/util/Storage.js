import {Component} from 'react';
import {AsyncStorage} from 'react-native';

class Storage extends Component{
	constructor(props){
		super(props);
	}

	static async setItem(key,value){
		try{
			await AsyncStorage.setItem(key,value);
		}catch(e){

		}
	}

	static async getItem(key){
		try{
			const value = await AsyncStorage.getItem(key);
			return value;
		}catch(e){

		}
	}
	static async delete(key){
		try{
			await AsyncStorage.removeItem(key);
		}catch(e){

		}
	}
	static async mutiRemove(keys){
		try{
			await AsyncStorage.multiRemove(keys);
		}catch(e){

		}
	}

	static async clear(){
		try{
			await AsyncStorage.clear();
		}catch(e){

		}
	}
}

export default Storage;

