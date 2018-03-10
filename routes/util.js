const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function getToken(headers) {
	if (headers && headers.authorization) {
		var parted = headers.authorization.split(' ');
		if (parted.length === 2) {
			return parted[1];
		} else {
			return null;
		}
	} else {
		return null;
	}
}

function createHash(password, callback) {
	bcrypt.hash(password, 10, callback);
}

function comparePassword(password, hash, callback) {
	bcrypt.compare(password, hash, callback);
}

function setToken(user) {
	return `JWT ${jwt.sign(user, 'secret', { expiresIn: '5h' })}`;
}

// To send mail after user login success
function sendMail(options, callback) {
	const mailOptions = {
		from: 'useraccount@gmail.com', // sender address
		to: options.to, // list of receivers
		subject: options.subject, // Subject line
		html: options.content// plain text body
	};

	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'useraccount@gmail.com',
			pass: 'password'
		}
	});

	transporter.sendMail(mailOptions, function (err, info) {
		if (err) {
			console.log(err);
			callback(err, null);
		} else {
			console.log(info);
			callback(null, info);
		}
	});
}

function getUserId(headers,callback){
    if (headers && headers.authorization) {
        var authorization = headers.authorization,
            decoded;
        try {
            decoded = jwt.verify(authorization, 'secret');
        } catch (e) {
			console.log('error', e);
			return null;
		}
		return decoded.id;
    } else {
		console.log('error');
		return null;
	}	
}

module.exports.createHash = createHash;
module.exports.getToken = getToken;
module.exports.setToken = setToken;
module.exports.sendMail = sendMail;
module.exports.comparePassword = comparePassword;
module.exports.getUserId = getUserId;