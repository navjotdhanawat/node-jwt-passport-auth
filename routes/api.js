const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../config/passport')(passport);
const bcrypt = require('bcrypt');
const { createHash, getToken, sendMail, setToken, comparePassword, getUserId } = require('./util');
var path = require('path');
var { User } = require('../models/users');
var mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


// Secure route and can be access by providing token
router.get('/dashboard',passport.authenticate('jwt', { session: false }), function (req, res) {

	var user = {
		name: 'asdf',
		email: 'asdfa@asdf.com'
	};
	res.json(user);
});

router.post('/register', function (req, res, next) {
	console.log(req.body);
	createHash(req.body.password, function (err, hash) {

		var user = new User({
			"firstname": req.body.firstname,
			"lastname": req.body.lastname,
			"email": req.body.email,
			"password": hash
		});
		user.save(function (err) {
			if (!err) {
				res.json({
					success: true,
					message: "User registered sucessfully"
				});
			} else {
				if (err.code === 11000) {
					res.json({ succes: false, error: 'User already exist!' });
				} else {
					res.json({ success: false, error: 'Something went wrong' });
				}
			}
		});
	});
});

router.post('/login', function (req, res, next) {
	var email = req.body.email;
	var password = req.body.password;
	console.log(req.body);

	User.findOne({ email: email }, function (err, user) {
		if (err) {
			console.log("error ocurred", err);
			res.send({
				"success": false,
				"error": "Something is wrong with server!!!"
			});
		} else {
			if (user) {
				comparePassword(password, user.password, function (err, result) {
					if (result) {
						// Send email to user after successful login
						var options = {
							to: email,
							content: '<p>Login alert!!!</p>',
							subject: 'Login Notification'
						};

						console.log('User-----', typeof user);
						sendMail(options, function (err, info) {
							console.log(err);
							console.log(info);
						});
						res.json({ success: true, user: user, token: setToken({ id: user._id, email: user.email }) });
					} else {
						res.json({
							"success": false,
							"error": "Email and password does not match"
						});
					}
				});
			} else {
				res.json({
					"success": false,
					"error": "Email does not exits"
				});
			}
		}
	});
});

module.exports = router;
