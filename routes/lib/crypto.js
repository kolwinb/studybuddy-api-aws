var crypto = require("crypto");
var path = require('path');
var fs = require("fs");
var util = require("util");

const algorithm='aes-256-ctr';
//const password='d6F3Efeq';
//const key = Buffer.concat([Buffer.from(password)], Buffer.alloc(32).length);
//console.log("crypto module : key :"+key);
//const iv = Buffer.from(key.slice(0,16));
//console.log("crypto module : iv :"+iv);

const pubKeyPath='./crypto/rsa_4096_pub.pem';
const privKeyPath='./crypto/rsa_4096_priv.pem';

module.exports =	{
	encryptRsa: function(toEncrypt, callback) {
		const absolutePath = path.resolve(pubKeyPath);
		const publicKey = fs.readFileSync(absolutePath, 'utf8');
		const buffer = Buffer.from(toEncrypt, 'utf8');
		const encrypted = crypto.publicEncrypt(publicKey, buffer);
		callback(encrypted.toString('base64'));
	},
	decryptRsa: function (toDecrypt, callback) {
		const absolutePath = path.resolve(privKeyPath);
		const privateKey = fs.readFileSync(absolutePath, 'utf8');
		const buffer = Buffer.from(toDecrypt, 'base64');
		const decrypted = crypto.privateDecrypt(
			{
				key: privateKey.toString(),
				passphrase: '',
			},
			buffer,);
		callback(decrypted.toString('utf8'));
	},
	encryptAes: function(text,callback){
		const password='d6F3Efeq'; //this should change as parameter when in production
		const key = Buffer.concat([Buffer.from(password)], Buffer.alloc(32).length);
		const iv = Buffer.from(key.slice(0,16));
		var cipher = crypto.createCipheriv(algorithm,key,iv)
		var crypted = cipher.update(text,'utf8','hex')
		crypted += cipher.final('hex');
		callback(crypted);
	},
	decryptAes: function (text,callback){
		const password='d6F3Efeq'; //this should change as parameter when in production
		const key = Buffer.concat([Buffer.from(password)], Buffer.alloc(32).length);
		const iv = Buffer.from(key.slice(0,16));
		console.log("decrypted iv :"+iv);
		let encryptedText = Buffer.from(text, 'hex');
		var decipher = crypto.createDecipheriv(algorithm,key,iv)
		var decrypted = decipher.update(encryptedText)
		decrypted = Buffer.concat([decrypted, decipher.final()]);
		callback(decrypted);
	},
	//encrypt pbkdf2
	encryptPbkdf2: function(var_data,callback){
		crypto.DEFAULT_ENCODING = 'base64';
		crypto.pbkdf2(var_data.password,var_data.mobile, 1000, 64 , 'sha512', (err, derivedKey) => {
			if (err) throw err;
			callback (derivedKey);
		});
	}

//decrypt AES:RSA 
//AES decryption required password
//AES password should encrypt with public key and decrypt with rsa private key.
// AES : publickey(AESPassword)

}
