var fs = require("fs")
  , _ = require('underscore')
  , Plates = require('plates')

module.exports = (function() {
  var layout = fs.readFileSync("./views/layout.html", "utf-8");
  var header = fs.readFileSync("./views/_header.html", "utf-8");
  var footer = fs.readFileSync("./views/_footer.html", "utf-8");
  var content = fs.readFileSync("./views/content.html", "utf-8");
  var user    = fs.readFileSync("./views/user.html", "utf-8");
  
  var collection = [
    {id: 1, place: 'france', 'name': 'Louis CK'},
    {id: 2, 'name': 'Andy Kindler'},
    {id: 3, 'name': 'Greg Giraldo'}
  ];
  var map = Plates.Map().class('name').to('name').where('href').has(/foo/).insert('id'); // `has` can take a regular expression.
  var index = Plates.bind(layout, {header: header, footer: footer});
  var home = Plates.bind(index, {content: Plates.bind(content, collection, map)})
  var User = { 
    create : Plates.bind(index, {content: user}),
    error: function(params, errs) {
      var err_html = Plates.bind('<div class="message"></div>', errs);
      var map = Plates.Map();
      _.each(params, function(v, k) {map.where('name').is(k).use(k).as('value');});
      return Plates.bind(Plates.bind(this.create, params, map), {errors: err_html});
    },
    all: function(xs) {
      var map = Plates.Map().class('name').to('name').where('href').has(/foo/).insert('id');
      return Plates.bind(index, {content: Plates.bind(content, xs, map)+"</br><a href='/users/new'>New</a>"})
    },
    edit : function(u) {
      var map = Plates.Map();
      u.path = u._id+'/update';
      map.where('name').is('name').use('name').as('value')
      map.where('href').has('new').insert('path')
      return Plates.bind(this.create, u, map);
    }
  }
  
  return {
    home: home,
    user: User
  }
})();
