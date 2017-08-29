
function requestMethod(method,url,param,loginToken,userId){
  	var promise = new Promise(function(resolve, reject){
	    var client = new XMLHttpRequest();
	    if(method === 'GET' || method === 'DELETE' ){
	    	url += '?';
	    	if(param){
	    		for(let ele in param){
	    			if(param.hasOwnProperty(ele)){
	    				url += (ele+'='+param[ele]+'&');
	    			}
	    		}
	    		url = url.slice(0,url.length-1);
	    	}
	    }
	    client.open(method, url);
	    client.timeout = 10000;
	    client.onreadystatechange = handler;

	    client.setRequestHeader('Content-type', 'application/json');
	    client.setRequestHeader('Accept', 'application/json');
	    if(loginToken){
			client.setRequestHeader('x-login-token',loginToken);
			client.setRequestHeader('x-user-id',userId);
		}

	    if(method === 'GET' || method === 'DELETE') client.send();
	  	else client.send(JSON.stringify(param));

	    function handler() {
	      if (client.readyState !== 4) {
	        return;
	      }
	      if (client.status === 200) {
	        resolve(client._response);
	      } else {
	      	if(client._response.indexOf('!!') > -1){
	      		reject(client._response);
	      	}else{
	        	reject('无法连接到服务器');
	      	}
	      }
	    };
  	});

	return promise;
}

function timeFormat(time){
	let t = new Date(time*1000);
	let year = t.getFullYear();
	let month = t.getMonth() + 1;
	if(month < 10) month = '0'+month;
	let day = t.getDate();
	if(day < 10) day = '0'+day;
	let hour = t.getHours();
	if(hour < 10) hour = '0'+hour;
	let min = t.getMinutes();
	if(min < 10) min = '0'+min;

	return year + '-'+ month + '-' + day;
}

export { requestMethod,timeFormat };