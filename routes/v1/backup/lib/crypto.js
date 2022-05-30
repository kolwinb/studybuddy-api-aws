var crypto = require("crypto");
var path = require('path');
var fs = require("fs");


let algorithm='aes-256-ctr';
let password='d6F3Efeq';
let key = Buffer.concat([Buffer.from(password)], Buffer.alloc(32).length);
console.log("crypto module : key :"+key);
let iv = Buffer.from(key.slice(0,16));
console.log("crypto module : iv :"+iv);

let pubkey='./crypto/rsa_4096_pub.pem'

function rsaEncrypt(toEncrypt, relativeOrAbsolutePathToPublicKey) {
	const absolutePath = path.resolve(relativeOrAbsolutePathToPublicKey)
	const publicKey = fs.readFileSync(absolutePath, 'utf8')
	const buffer = Buffer.from(toEncrypt, 'utf8')
	const encrypted = crypto.publicEncrypt(publicKey, buffer)
	return encrypted.toString('base64')
}

function rsaDecrypt(toDecrypt, relativeOrAbsolutePathtoPrivateKey) {
	const absolutePath = path.resolve(relativeOrAbsolutePathtoPrivateKey)
	const privateKey = fs.readFileSync(absolutePath, 'utf8')
	const buffer = Buffer.from(toDecrypt, 'base64')
	const decrypted = crypto.privateDecrypt(
		{
			key: privateKey.toString(),
			passphrase: '',
		},
		buffer,)
	return decrypted.toString('utf8')
}
function aes_256_encrypt(text,passwd){
	var cipher = crypto.createCipheriv(algorithm,key,iv)
	var crypted = cipher.update(text,'utf8','hex')
	crypted += cipher.final('hex');
	return crypted;
}

function aes_256_decrypt(text,passwd){
	//let iv = key.slice(0, 16);
	console.log("decrypted iv :"+iv);
	let encryptedText = Buffer.from(text, 'hex');
	var decipher = crypto.createDecipheriv(algorithm,key,iv)
	var decrypted = decipher.update(encryptedText)
	decrypted = Buffer.concat([decrypted, decipher.final()]);
	return decrypted;
}


/*
//old AES Cipher warnings occure plese use Cipheriv
function aes_256_encrypt(text,passwd){
	var cipher = crypto.createCipher(algorithm,passwd)
	//      var cipher = crypto.Cipheriv(algorithm,passwd)
	var crypted = cipher.update(text,'utf8','hex')
	crypted += cipher.final('hex');
	return crypted;
}

function aes_256_decrypt(text,passwd){
	var decipher = crypto.createDecipher(algorithm,passwd)
	//      var decipher = crypto.Cipheriv(algorithm,passwd)
	var dec = decipher.update(text,'hex','utf8')
	dec += decipher.final('utf8');
	return dec;
 }
 */

//encrypt AES password by RSA algorithm

exports.encryptAesRsa=function(var_data,callback){
	enc_passwd = rsaEncrypt(password, pubkey);
    var enc_data = aes_256_encrypt(var_data,password);
    
	return callback(enc_data+":"+enc_passwd);
}

//Decrypt AES
exports.decryptAes=function(var_data,callback){
    dec_data=aes_256_decrypt(var_data,password);
    console.log("crypto module : decryptAES :"+dec_data);
	return callback(dec_data);
}

//Encrypt AES
exports.encryptAes=function(var_data,callback){
	console.log("crypto module : encryptAES : "+var_data);
//	var enc_data = aes_256_encrypt('{"subscriber_id":"'+var_subscriberId+'","device_id":"'+var_dev$
	var enc_data = aes_256_encrypt(var_data,password);
	console.log("crypto module : encryptAES :"+enc_data);

	dec_data=aes_256_decrypt(enc_data,password);
	console.log("crypto module : encryptAES :"+dec_data);
 	
	return callback(enc_data);
}


//decrypt AES:RSA 
exports.decryptAesRsa=function(var_data,callback){
	console.log("crypto module : decryptAesRsa : "+var_data);
	var data = var_data.split(":");
	varData=data[0]; //AES portion of json data
	console.log("crypto modeul : decryptAesRsa : "+varData);
	varKey=data[1]; //RSA portion of json data
	console.log("crypto module : decryptAesRsa : "+varKey);
	
	//decrypt password
	const password = rsaDecrypt(varKey, 'crypto/rsa_4096_priv.pem');
	console.log('crypto module : decryptAesRsa', password);

	//decrypt AES
	dec_data=aes_256_decrypt(varData,password,key,iv);
	console.log("crypto module : decryptAesRsa : "+dec_data);
	//***AES END***//
	
	return callback(dec_data)

};
