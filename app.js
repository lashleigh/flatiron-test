// Require flatiron and grab the app object.
var flatiron = require('flatiron')
  , app = flatiron.app
  , restful = require('restful')
  , resourceful = require('resourceful')
  , nconf = require('nconf')
  , ecstatic = require('ecstatic')
  , fixture = require('./models/fixture')
  , myplates = require('./myplates');

// Use the http plugin. This makes flatiron act as an http server with a
// router on `app.router`.
app.use(flatiron.plugins.http, {
  headers: {
    'x-powered-by': 'flatiron ' + flatiron.version,
    'Access-Control-Allow-Origin': 'http://alghwstaging.kineticbooks.com'
  }
});
app.http.before = [
  ecstatic(__dirname + '/public')
];

nconf.use('file', {file: './config/config.json'});
var database = nconf.get(app.env+':database')
app.resources = {};
app.resources.user = fixture.user;
    console.log(app.resources.user)
app.resources.user.use('couchdb', {uri: database+'/users'})
// Route handler for http GET on the root path
/*app.router.get('/', function () {
  // Handle the response as you would normally.
  this.res.writeHead(200, { 'content-type': 'text/html'});
  this.res.end(myplates.home);
});*/
app.router.get('/users', function () {
  // Handle the response as you would normally.
  var self = this;
  app.resources.user.all(function(err, doc) {
    self.res.writeHead(200, { 'content-type': 'text/html'});
    self.res.end(myplates.user.all(doc));
  });
});
app.router.path('/users/new', function() {
  this.get(function() {
    this.res.writeHead(200, { 'content-type': 'text/html'});
    this.res.end(myplates.user.create);
  });
  this.post(function() {
    var self = this;
    var user = new app.resources.user(self.req.body);
    var v = user.validate();
    if(v.valid) {
      user.save(function(err, doc) {
        self.res.writeHead(303, { 'Location': '/users/'+doc._id});
        self.res.end(myplates.user.edit(doc));
      });
    } else {
      self.res.writeHead(200, { 'content-type': 'text/html'});
      self.res.end(myplates.user.error(self.req.body, v.errors));
    }
  });
})

app.router.get('/users/:id', function(id) {
  var self = this;
  app.resources.user.get(id, function(err, doc) {
    if(!doc) return
    
    self.res.writeHead(200, { 'content-type': 'text/html'});
    self.res.end(myplates.user.edit(doc));
  })
});

app.use(restful);
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
