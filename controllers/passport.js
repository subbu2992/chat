var LocalStrategy    = require('passport-local').Strategy;


var User  = require('../models/user');


module.exports = function(passport) {

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user){
        if(!err) done(null, user);
        else done(err, null)  
    })
});

 passport.use('local-signup', new LocalStrategy({

        usernameField : 'name',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, name, password, done) {

        process.nextTick(function() {

        User.findOne({ 'name' :  name }, function(err, user) {
            if (err)
                return done(err);

            if (user) {
                return done(null, false, req.flash('signupMessage', 'Name is already taken.'));
            } else {

                var newUser    = new User();

                newUser.name    = name;
                newUser.password = newUser.generateHash(password);


                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

        });

    }));

 passport.use('local-login', new LocalStrategy({
        usernameField : 'name',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, name, password, done) { 

        // console.log(req.body);
        User.findOne({ 'name' :  name }, function(err, user) {
            if (err)
                return done(err);

            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); 

            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Wrong password.')); 
            return done(null, user);
        });

    }));

 passport.use('local-forget', new LocalStrategy({
        usernameField : 'name',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, name, password, done) {

        process.nextTick(function() {

        User.findOne({ 'name' :  name }, function(err, user) {
              if (err)
                return done(err);

            if (!user)
                return done(null, false, req.flash('message', 'No user found.'));

            if(user)
             {

                user.update({
                    "password" : user.generateHash(password)

                   },function(err){
                    if (err)
                        throw err;
                    return done(null, user);
                });
            }

        });    

        });

    }));



};

