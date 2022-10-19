const axios = require('../../lib/node_modules/axios');


//  method: 'post',
//url: 'https://api.dialog.lk/subscription/otp/request',
//  data: {

const options = {
headers:{'content-type':'Application/json'}
};

axios.post('https://api.dialog.lk/subscription/otp/request',{
"applicationId": "APP_060570",
"password": "9df31a15a3d809a98d6758baef90f433",
"subscriberId": "tel:94777748260",
"applicationHash": "abcdefgh",
"applicationMetaData": {
"client": "MOBILEAPP",
"device": "iPhone 10X",
"os": "iOS 14",
"appCode": "https://play.google.com/store/apps/details?id=com.mbrain.learntv"

}
},options)
.then(response => {
console.log(response.data);
})
.catch(error => {
console.error(error);
});
