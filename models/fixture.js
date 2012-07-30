var resourceful = require('resourceful')
var fixtures = module.exports;

fixtures.user = resourceful.define('user', function () {
  this.restful = true;
  /*this.use('couchdb', {
    uri: config.db+'/users'
  });*/
  this.string('name', {
    required: true,
    conform: function(val) { return val.length >= 4; },
    message: 'Name must be at least 4 characters'
  })
  this.timestamps();

  this.filter('byName', function(name) {
    return {name: name};
  })

  this.on('error', function() {
    console.log(arguments);
  })
});
fixtures.problem = resourceful.define('problem', function() {
  this.restful = true;
  this.use('couchdb', {
    //uri: 'couchdb://127.0.0.1:5984/problems' 
    //uri: 'couchdb://nodejitsudb784845289842.iriscouch.com:5984/problems'
    uri: config.db+'/users'
  });

  this.string('question');
  this.string('answer');
  this.string('wid');
  this.array('steps');
  this.object('self');
  this.timestamps();
});
