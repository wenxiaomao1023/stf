var dbapi = require('../../../db/api')
var jwtutil = require('../../../util/jwtutil')
var urlutil = require('../../../util/urlutil')
var logger = require('../../../util/logger')

var log = logger.createLogger('api:helpers:securityHandlers')

module.exports = {
  accessTokenAuth: accessTokenAuth
}

// Specifications: https://tools.ietf.org/html/rfc6750#section-2.1

function accessTokenAuth(req, res, next) {
  if (req.headers.authorization) {
    var authHeader = req.headers.authorization.split(' ')
    var format = authHeader[0]
    var tokenId = authHeader[1]

    if (format !== 'Bearer') {
      return res.status(401).json({
        success: false
      , description: 'Authorization header should be in "Bearer $AUTH_TOKEN" format'
      })
    }

//wen del
/*
    if (!tokenId) {
      log.error('Bad Access Token Header')
      return res.status(401).json({
        success: false
      , description: 'Bad Credentials'
      })
    }
*/
//wen end

    dbapi.loadAccessToken(tokenId)
      .then(function(token) {
//wen del
/*
        if (!token) {
          return res.status(401).json({
            success: false
          , description: 'Bad Credentials'
          })
        }

        var jwt = token.jwt

        var data = jwtutil.decode(jwt, req.options.secret)
*/
//wen end

//wen add
//data={email: 'example@le.com', name: 'example@le.com'}
//[username][repat][le][repdot][com][repsplit]000000000000.... length 64
//stf/lib/units/auth/ldap.js
        var data=null
        //not login before
        if (!token) {
          var email=tokenId.split('repsplit')[0].replace(/rephyphen/g,'-').replace(/repat/g,'@').replace(/repdot/g,'.')
          data={}
          data.email=email
          data.name=email.split('@')[0]

          //[username][repat][le][repdot][com][repsplit]000000000000.... length 64
          //stf/lib/units/api/helpers/securityHandlers.js
          var token = jwtutil.encode({
            payload: {
              email: data.email
              , name: data.name
            }
            , secret: 'kute kittykat'
            , header: {
              exp: Date.now() + 24 * 3600
            }
          })
          dbapi.saveUserAccessToken(data.email, {
            title: 'token'
            , id: tokenId
            , jwt: token
          })

          dbapi.saveUserAfterLogin({
            name: data.name
            , email: data.email
            , ip: ''
          })
        }
        else{
            var jwt = token.jwt
            data = jwtutil.decode(jwt, req.options.secret)
            if (!data) {
              var email=(token.id).split('repsplit')[0].replace(/rephyphen/g,'-').replace(/repat/g,'@').replace(/repdot/g,'.')
              data={}
              data.email=email
              data.name=email.split('@')[0]
            }                  
        }
//wen end

        if (!data) {
          return res.status(500).json({
            success: false
          })

        }

        dbapi.loadUser(data.email)
          .then(function(user) {
            if (user) {
              req.user = user
              next()
            }
            else {
              return res.status(500).json({
                success: false
              })
            }
          })
          .catch(function(err) {
            log.error('Failed to load user: ', err.stack)
          })
      })
      .catch(function(err) {
        log.error('Failed to load token: ', err.stack)
        return res.status(401).json({
          success: false
        , description: 'Bad Credentials'
        })
      })
  }
  // Request is coming from browser app
  // TODO: Remove this once frontend become stateless
  //       and start sending request without session
  else if (req.session && req.session.jwt) {
    dbapi.loadUser(req.session.jwt.email)
      .then(function(user) {
        if (user) {
          req.user = user
          next()
        }
        else {
          return res.status(500).json({
            success: false
          })
        }
      })
      .catch(next)
  }
  else {
    res.status(401).json({
      success: false
    , description: 'Requires Authentication'
    })
  }
}
