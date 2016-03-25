'use strict';

/**
 * Module dependencies.
 */
var
  util                = require('util'),
  _                   = require('underscore'),
  Profile             = require('./profile'),
  OAuth2Strategy      = require('passport-oauth').OAuth2Strategy,
  InternalOAuthError  = require('passport-oauth').InternalOAuthError;


/**
 * `Strategy` constructor.
 */
function Strategy (options, verify) {
  options = options || {};

  options.authorizationURL = options.authorizationURL ||
      'https://enertalk-auth.encoredtech.com/login';
  options.tokenURL = options.tokenURL ||
      'https://enertalk-auth.encoredtech.com/token';

  OAuth2Strategy.call(this, options, verify);
  this.name = 'encored-enertalk';

  this._profileURL = options.profileURL || 'https://api.encoredtech.com/1.2/me';
  this._oauth2.setAccessTokenName('access_token');
  this._oauth2.useAuthorizationHeaderforGET(true);
}


/**
 * Inherit from `OAuthStrategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Return extra parameters to be included in the authorization request.
 */
Strategy.prototype.authorizationParams = function (options) {
  // Do not modify `options` object.
  // It will hurts original options object which in `passport.authenticate(..., options)`
  return _.extend({
    app_version: 'web',
    back_url: '/authorization'
  }, options);
};


/**
 * Retrieve user profile from Stack Exchange.
 */
Strategy.prototype.userProfile = function (accessToken, done) {
  // We need to use `request` module
  // because all of protected resources will be compressed.
  // @see https://api.stackexchange.com/docs/compression
  this._oauth2.get(this._profileURL, accessToken, function (err, body) {
    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }

    var json = {};

    try {
      json = JSON.parse(body);
    } catch (e) {
      // something went wrong during parse JSON.
      // e.g. Malformed JSON string.
      return done(new InternalOAuthError('Malformed response.', e));
    }

    if (!json.userId) {
      return done(new InternalOAuthError('Empty response.'));
    }

    // compose the profile object
    var profile = Profile.parse(json);
    profile.provider = 'encoredtech-enertalk';
    profile._raw = body;
    profile._json = json;

    done(null, profile);
  });
};

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;