(function () {
    'use strict';

    angular.module('sodinApp',
        [
            // Angular modules 
            'ngRoute', 'ngSanitize', 'ngTable', 'ngTimeline',
            // Custom modules 

            // 3rd Party Modules
            'ui-leaflet', 'ui.materialize', 'angularMoment'
        ])
        .config([
            '$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
                $routeProvider
                    .when('/', { templateUrl: '/views/visor.html' })
                    .when('/visor', { templateUrl: '/views/visor.html' })
                    .when('/eventTimeline/:idEvento/:isOnlyWithPhotos', { templateUrl: '/views/eventTimeline.html' })
                    .otherwise({ redirectTo: '/' });
                $locationProvider.hashPrefix('');
            }])
        .constant('SODIN_CONFIG', { 'VERSION': '1.3' });
})();