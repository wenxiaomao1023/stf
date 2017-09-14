require('./docs.css')

module.exports = angular.module('stf.help.docs', [
  require('stf/language').name
])
  .config(function($routeProvider, languageProvider) {
    // TODO: Solutions to the lang problem
    //
    // 1) Use $route inside a controller instead of $routeProvider
    // 2) Use $routeProvider along with languageProvider
    // In this case languageProvider depends on Settings and gettext
    // which are not providers
    // 3) Easiest way is to use AppState
    // 4) It needs a fallback if the language doesn't exists, it can be made
    // in Express side.

    $routeProvider
      .when('/docs/:document*', {
//wen add
        redirectTo: '/devices'
//wen end
//wen del
/*
        templateUrl: function(params) {
          var lang = languageProvider.$get().selectedLanguage
          lang = 'en' // Only English for now
          var document = params.document.replace('.md', '')
          return '/static/wiki/[' + lang + ']-' + document
        }
*/
//wen end
      })
      .when('/help', {
//wen add
        redirectTo: '/devices'
//wen end
//wen del
/*
        templateUrl: function() {
          var lang = languageProvider.$get().selectedLanguage
          lang = 'en' // Only English for now
          return '/static/wiki/[' + lang + ']-Help'
        }
*/
//wen end
      })
      //.when('/docs/:lang/:document*', {
      //  templateUrl: function (params) {
      //    var lang = params.lang
      //    var document = params.document.replace('.md', '')
      //    return '/static/docs/' + lang + '/' + document
      //  }
      //})

  })
  .controller('DocsCtrl', require('./docs-controller'))
