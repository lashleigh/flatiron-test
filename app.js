// Require flatiron and grab the app object.
var flatiron = require('flatiron')
  , app = flatiron.app
  , restful = require('restful')
  , resourceful = require('resourceful')
  , fixture = require('./models/fixture')
  , myplates = require('./myplates');

// Use the http plugin. This makes flatiron act as an http server with a
// router on `app.router`.
app.resources = {};
app.resources.user = fixture.user;
app.resources.problem = fixture.problem;
app.use(flatiron.plugins.http, {
  headers: {
    'x-powered-by': 'flatiron ' + flatiron.version,
    'Access-Control-Allow-Origin': 'http://alghwstaging.kineticbooks.com'
  }
});

// Route handler for http GET on the root path
/*app.router.get('/', function () {
  // Handle the response as you would normally.
  this.res.writeHead(200, { 'content-type': 'text/html'});
  this.res.end(myplates.home);
});*/
app.router.get('/users', function () {
  // Handle the response as you would normally.
  var that = this;
  app.resources.user.all(function(err, doc) {
    that.res.writeHead(200, { 'content-type': 'text/html'});
    that.res.end(myplates.user.all(doc));
  });
});
app.router.get('/users/new', function() {
  this.res.writeHead(200, { 'content-type': 'text/html'});
  this.res.end(myplates.user.create);
})
app.router.post('/users/new', function() {
  var self = this;
  var user = new app.resources.user(self.req.body);
  var v = user.validate();
  if(v.valid) {
    user.save(function(err, doc) {
      self.res.writeHead(303, { 'Location': '/users/'+doc._id});
      self.res.end(myplates.user.edit(doc));
    });
  } else {
    console.log(v);
    self.res.writeHead(200, { 'content-type': 'text/html'});
    self.res.end(myplates.user.error(v));
  }
  //self.res.writeHead(303, {'Location': '/users'});
  //self.res.end();
});

app.router.get('/users/:id', function(id) {
  var that = this;
  app.resources.user.get(id, function(err, doc) {
    if(!doc) return
    
    that.res.writeHead(200, { 'content-type': 'text/html'});
    that.res.end(myplates.user.edit(doc));
  })
});

app.use(restful);
// Start the server!
app.start(8080, function (err) {
  if (err) {
    // This would be a server initialization error. If we have one of these,
    // the server is probably not going to work.
    throw err;
  }

  // Log the listening address/port of the app.
  var addr = app.server.address();
  app.log.info('Listening on http://' + addr.address + ':' + addr.port);
});
