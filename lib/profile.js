'use strict';

/**
 * Parse Profile of User
 *
 * @param {Object|String} json
 * @return {Object}
 * @api private
 */

var Profile =  {};

Profile.parse = function parseProfile (obj) {
  if (typeof obj === 'string') {
    obj = JSON.parse(obj);
  }

  var profile = {};

  /* jshint ignore:start */
  /*
  code	Number	response code for this request
  message	String	response message for this request
  userId	Number	user id
  nickName	String	user nickname 사용자 별명
  email	String	email address 사용자 이메일 정보
  phone	String	phone number 사용자 휴대폰 번호
  agreementSMS	Bool	agreement for SMS 문자 수신 동의 여부
  agreementEmail	Bool	agreement for Email 이메일 수신 동의 여부
  meteringDay	Number	metering day 검침일
  contractType	Number	contract type (mW)
  contractPower	Number	contract power
  maxLimitUsage	Number	planed usage
  maxLimitUsageBill	Number	expected bill for planed usage
  needUpdate	Bool	whether mobile app need to be updated
  */
  profile.id = obj.userId;
  profile.displayName = obj.nickName;
  profile.email = obj.email;
  profile.phone = obj.phone;
  profile.meteringDay = obj.meteringDay;
  profile.contractType = obj.contractType;
  profile.contractPower = obj.contractPower;
  profile.maxLimitUsage = obj.maxLimitUsage;
  profile.maxLimitUsageBill = obj.maxLimitUsageBill;

  /* jshint ignore:end */

  return profile;
};

module.exports = exports = Profile;