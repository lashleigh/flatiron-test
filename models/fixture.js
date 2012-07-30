var resourceful = require('resourceful');
var fixtures = module.exports;

fixtures.user = resourceful.define('user', function () {
  this.restful = true;
  this.use('couchdb'); //The uri is set in app.js

  this.string('name', {
    required: true,
    conform: function(val) { return val.length >= 4; },
    message: 'Name must be at least 4 characters'
  });
  this.string('lastName', {
    required: true,
    conform: function(val) { return val.length >= 4; },
    message: 'Name must be at least 2 characters'
  });
  this.number('age', {
    required: false,
    conform: function(val) {return val >= 5 && val <= 75;},
    message: 'A reasonable age please'
  });

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
  this.use('couchdb');

  this.string('question');
  this.string('answer');
  this.string('wid');
  this.array('steps');
  this.object('self');
  this.timestamps();
});
