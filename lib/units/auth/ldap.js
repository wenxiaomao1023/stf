var http = require('http')
//wen add
var util = require('util')
//var uuid = require('uuid')
//wen end

var express = require('express')
var validator = require('express-validator')
var cookieSession = require('cookie-session')
var bodyParser = require('body-parser')
var serveStatic = require('serve-static')
//wen del
//var csrf = require('csurf')
//wen end
var Promise = require('bluebird')

var logger = require('../../util/logger')
var requtil = require('../../util/requtil')
var ldaputil = require('../../util/ldaputil')
var jwtutil = require('../../util/jwtutil')
var pathutil = require('../../util/pathutil')
var urlutil = require('../../util/urlutil')
var lifecycle = require('../../util/lifecycle')
//wen add
var dbapi = require('../../db/api')
//wen end

module.exports = function(options) {
  var log = logger.createLogger('auth-ldap')
  var app = express()
  var server = Promise.promisifyAll(http.createServer(app))

  lifecycle.observe(function() {
    log.info('Waiting for client connections to end')
    return server.closeAsync()
      .catch(function() {
        // Okay
      })
  })

  app.set('view engine', 'pug')
  app.set('views', pathutil.resource('auth/ldap/views'))
  app.set('strict routing', true)
  app.set('case sensitive routing', true)

  app.use(cookieSession({
    name: options.ssid
  , keys: [options.secret]
  }))
  app.use(bodyParser.json())
  //wen del
  //app.use(csrf())
  //wen end
  app.use(validator())
  app.use('/static/bower_components',
    serveStatic(pathutil.resource('bower_components')))
  app.use('/static/auth/ldap', serveStatic(pathutil.resource('auth/ldap')))

  app.use(function(req, res, next) {
    //wen del
    //res.cookie('XSRF-TOKEN', req.csrfToken())
    //wen end
    //wen add
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");    
    //wen end
    next()
  })

  app.get('/', function(req, res) {
    res.redirect('/auth/ldap/')
  })

  app.get('/auth/ldap/', function(req, res) {
    res.render('index')
  })

  app.post('/auth/api/v1/ldap', function(req, res) {
    var log = logger.createLogger('auth-ldap')
    log.setLocalIdentifier(req.ip)
    switch (req.accepts(['json'])) {
      case 'json':
        requtil.validate(req, function() {
            req.checkBody('username').notEmpty()
            req.checkBody('password').notEmpty()
          })
          .then(function() {
            return ldaputil.login(
              options.ldap
            , req.body.username
            , req.body.password
            )
          })
          .then(function(user) {
            log.info('Authenticated "%s"', ldaputil.email(user))
            var token = jwtutil.encode({
              payload: {
                email: ldaputil.email(user)
              , name: user[options.ldap.username.field]
              }
            , secret: options.secret
            , header: {
                exp: Date.now() + 24 * 3600
              }
            })
//wen add
//[username][repat][le][repdot][com][repsplit]000000000000.... length 64
//stf/lib/units/api/helpers/securityHandlers.js
          //var tokenId = util.format('%s-%s', uuid.v4(), uuid.v4()).replace(/-/g, '')
          var id=ldaputil.email(user).replace(/-/g,'rephyphen').replace(/@/g,'repat').replace(/\./g,'repdot')+'repsplit'
          while(id.length<64){
            id+='0'
          }
          dbapi.saveUserAccessToken(ldaputil.email(user), {
            title: 'token'
          , id: id
          , jwt: token
          })
//wen end
            res.status(200)
              .json({
                success: true
              , redirect: urlutil.addParams(options.appUrl, {
                  jwt: token
                })
              })
          })
          .catch(requtil.ValidationError, function(err) {
            res.status(400)
              .json({
                success: false
              , error: 'ValidationError'
              , validationErrors: err.errors
              })
          })
          .catch(ldaputil.InvalidCredentialsError, function(err) {
            log.warn('Authentication failure for "%s"', err.user)
            res.status(400)
              .json({
                success: false
              , error: 'InvalidCredentialsError'
              })
          })
          .catch(function(err) {
            log.error('Unexpected error', err.stack)
            res.status(500)
              .json({
                success: false
              , error: 'ServerError'
              })
          })
        break
      default:
        res.send(406)
        break
    }
  })

  server.listen(options.port)
  log.info('Listening on port %d', options.port)
}
