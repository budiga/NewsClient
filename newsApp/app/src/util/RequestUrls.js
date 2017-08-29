

const baseUrl = 'http://127.0.1.1';

const reqUrls = {
	//我的页面
	getUserInfo:baseUrl + '/user/user',//获取用户信息

	//主界面
	videoList : baseUrl + '/item/actioners',//视频列表
	imageList : baseUrl + '/item/photos',//图片列表
	textList :  baseUrl + '/item/articles',//文章列表
	typeList : baseUrl + '/item/type',//类型列表
	
	login : baseUrl + '/user/login',//登陆
	logout : baseUrl + '/user/logout',//登出
	register : baseUrl + '/user/register',//登陆
	recharge : baseUrl + '/user/recharge',//充值
	exchange : baseUrl + '/user/transfer',//转账
	collect : baseUrl + '/user/wishes',//收藏列表
	resetPwd : baseUrl + '/user/pwd',//修改密码
	bindEmail : baseUrl + '/user/email',//绑定邮箱
	payItem : baseUrl + '/user/items',//支付选项
	noticeList : baseUrl + '/post/post',//公告接口
	postList : baseUrl + '/post/notice',//QQ、微信接口
	
	//详情页面
	deductGoldVideo : baseUrl + '/item/tip',//扣除视频文章金币
	deductGoldImage : baseUrl + '/item/tip',//扣除图片文章金币
	deductGoldText: baseUrl + '/item/tip',//扣除小说文章金币
	itemVideo: baseUrl + '/item/actioner',//查询视频文章详情
	itemImage: baseUrl + '/item/photo',//查询图片文章详情
	itemText: baseUrl + '/item/article',//查询小说文章详情
	foucs: baseUrl + '/user/wish',//收藏or取消
	praiseImage: baseUrl + '/photo/up',//点赞
	praiseText: baseUrl + '/article/up',//点赞
	praiseVideo: baseUrl + '/actioner/up',//点赞
	tipImage:baseUrl + '/photo/reward',
	tipText:baseUrl + '/article/reward',
	tipVideo:baseUrl + '/actioner/reward',


};

export { reqUrls };