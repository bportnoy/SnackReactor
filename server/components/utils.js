var OrganizationRestaurant = require('../database/models/organization_restaurant.js');
var Rating = require('../database/models/rating.js');

exports.authenticate = function(req, res, next){
  if (!req.isAuthenticated()) res.send(401);
  else next();
};

exports.calculateAvgRating = function(restaurantId, orgId){
  console.log('rest, org ' + restaurantId + ' ' + orgId);
  Rating.forge()
  .query(function(qb){
    qb.where({restaurant_id: restaurantId, organization_id: orgId})
    .avg('rating');
  }).fetch()
  .then(function(rating){
    console.log(rating);
    var avgRating = rating.get('avg(`rating`)');
    OrganizationRestaurant.forge({restaurant_id: restaurantId, organization_id: orgId})
    .fetch()
    .then(function(orgRest){
        orgRest.set('avg_rating', Math.round(avgRating));
        orgRest.save();
    });
  });
};