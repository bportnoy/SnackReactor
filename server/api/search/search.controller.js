/**
 * Endpoints
 * POST    /search    ->  query
 */

'use strict';

var _ = require('lodash');
var places = require('../places/places');
var Restaurant = require('../../database/models/restaurant');
var moment = require('moment-timezone');

exports.search = {
  // Issues a search to the DB
  query: function(req, res) {
    var price = req.body.price;
    var health = req.body.health;
    var userTimeZone = req.body.timeZone;
    var userTime = moment(req.body.time).tz(userTimeZone); // set the time back to the user's local time
    var day = userTime.day();
    var time = userTime.format('HH:mm:ss');
    // var organization_id = req.user.organization_id;
    new Restaurant()
      .query(function(qb){
        qb.join('hours', 'restaurants.id', '=', 'hours.restaurant_id');
        qb.where('restaurants.health', health).andWhere('restaurants.price', '>=', price)
        .andWhere('hours.day', day).andWhere('hours.open', '<', time).andWhere('hours.close', '>', time)
        .orderByRaw('random()').limit(3);// add organization_id here
      }) 
      .fetchAll().then(function(models) {
        // console.log(models);
        if (models.size()) {
          var results = [];
          models.forEach(function(model){
            //also need to fetch org-specific descriptions here
            //transform the photo reference into a URL
            model.set('photo_url',
              'https://maps.googleapis.com/maps/api/place/photo?maxwidth=1600&photoreference=' + model.get('photo_url') + '&key=AIzaSyDUYAAHTfuH1FhBacOWtF01FZGjF7Sd3mc');
            //and push the result into the results array
            results.push(model.toJSON());
          });
          res.send(200, results);
        } else {
          res.send(400, 'Error: No results returned from search.');
          console.error('No results returned from search.');
        }
      });
  }
};
