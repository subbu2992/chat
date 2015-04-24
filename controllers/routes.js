
module.exports = function(app, passport) {

    app.get('/', function(req, res) {
        res.render('login.ejs',{ message: req.flash('message') });
    });

     app.get('/login', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    })

    app.get('/forget', function(req, res) {
        res.render('forget.ejs', { message: req.flash('message') });
    })

    

    app.get('/chat', isLoggedIn, function(req, res) {
        res.render('chat.ejs',{
            user : req.user 
        });
    });
    

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/chat', 
        failureRedirect : '/signup', 
        failureFlash : true 
    }));

     app.post('/forget', passport.authenticate('local-forget', {
        successRedirect : '/chat', 
        failureRedirect : '/forget', 
        failureFlash : true 
    }));

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/chat', 
        failureRedirect : '/login',
        failureFlash : true 
    }));


    app.get('/logout',function(req, res) {
        req.logout();
        console.log("logout");
        res.redirect('/');
    });


};



function isLoggedIn(req, res, next) {
    console.log("islog");
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}