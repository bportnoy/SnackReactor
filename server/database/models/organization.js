var db = require('../config');
var User = require('./user');
var Restaurant = require('./restaurant');


var Organization = db.Model.extend({
  tableName: 'organizations',
  hasTimestamps: true,

  users: function(){
    return this.hasMany(User);
  },

  restaurants: function(){
    return this.belongsToMany(Restaurant);
  }
  
});


module.exports = Organization;