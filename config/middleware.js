module.exports.setFlash = function(req, res, next){  // this is middleware
    res.locals.flash = {                      // res.locals is used to pass data to views
        'success': req.flash('success'),   
        'error': req.flash('error')
    }

    next();   // next is used to move to next middleware
}