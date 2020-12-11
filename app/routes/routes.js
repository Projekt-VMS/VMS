app.use('/api', apiRouter);
app.use('/', router);

// home route
router.get('/', function(req, res) {
    res.render('index');
});

// admin route
router.get('/admin', function(req, res) {
    res.render('admin/login');
});

router.get('/admin/register', function(req, res) {
    res.render('admin/register');
});
