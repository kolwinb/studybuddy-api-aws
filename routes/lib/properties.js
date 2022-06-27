/*
exports.mobitelUrl="api.mspace.lk";
exports.dialogUrl="api.dialog.lk";
exports.idearmart="api.ideamart.io";

exports.dialogOtpRequest="https://api.dialog.lk/subscription/otp/request";
exports.dialogOtpVerify="https://api.dialog.lk/subscription/otp/verify";
exports.dialogActivate="https://api.ideamart.io/subscription/send";
exports.dialogStatus="https://api.ideamart.io/subscription/getStatus";
exports.dialogQuery="https://api.ideamart.io/subscription/query-base";
exports.dialogChargin="https://api.ideamart.lk/subscription/getSubscriberChargingInfo";

exports.mobitelOtpRequest="https://api.mspace.lk/otp/request";
exports.mobitelOtpVerify="https://api.mspace.lk/otp/verify";
exports.mobitelActivate="https://api.mspace.lk/subscription/send";
exports.mobitelStatus="https://api.mspace.lk/subscription/getStatus";
exports.mobitelQuery="https://api.mspace.lk/subscription/query-base";
exports.mobitelChargin="https://api.mspace.lk/subscription/notify";

exports.dialogAppId="APP_060570";
exports.dialogPassword="9df31a15a3d809a98d6758baef90f433";
exports.dialogAppHash="3lk2jk3l";
exports.dialogClient="MOBILEAPP";

exports.mobitelAppId="APP_000375";
exports.mobitelPassword="a07118cda5215fc6d01db5b2ab848edd";
exports.mobitelAppHash="3lk2jk3l";
exports.mobitelClient="MOBILEAPP";

exports.device="Web";
exports.os="Linux";
exports.appCode="https://play.google.com/store/apps/details?id=com.mbrain.learntv";
*/

var config={
	coin:100,
	apiUrl:'https://api.learntv.lk/studybuddy/v1',
	vodUrl:'http://edutv.lk/video',
	thumbUrl:'http://edutv.lk/img',
	videoQuality:{
					"small":"240p.m3u",
					"medium":"360p.m3u",
					"large":"480p.m3u"
				}


}
module.exports=config;
