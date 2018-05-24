(function () {
    'use strict';

    angular
        .module('sodinApp')
        .controller('EventTimelineCtrl', EventTimelineCtrl);

    EventTimelineCtrl.$inject = ['$scope', '$routeParams', '$timeout', 'moment', 'FactoryEvents', 'FactorySlides'];

    function EventTimelineCtrl($scope, $routeParams, $timeout, moment, FactoryEvents, FactorySlides) {
        /* jshint validthis:true */
        var vm = this;
        vm.activeEvent = FactoryEvents.data.activeEvent;
        vm.slides = FactorySlides.data.slides;

        $scope.options = {
            timenav_position: 'bottom',
            language: 'en',
            hash_bookmark: true,
            timenav_height: 150,
            debug: true,
            zoom_sequence: [0.5, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89],
            scale_factor: 1
        };
        $scope.goToSlide = goToSlide;

        activate();

        /* Functions */

        function activate() {
            initTimeline();
        }

        async function initTimeline() {
            if ($routeParams.idEvento) {
                const photoFilterIsActive = ($routeParams.isOnlyWithPhotos === 'true');
                await FactoryEvents.loadEvent($routeParams.idEvento, photoFilterIsActive);
                FactorySlides.createEventSlides(vm.activeEvent);
                loadTimeline();
            }
        }

        function goToSlide(id) {
            $scope.timeline.goToId(id);
        }

        function loadTimeline() {
            $timeout(function () {
                const data = {
                    'title': vm.slides.intro,
                    'events': vm.slides.data
                };

                $scope.timeline.setData(data);
                $scope.timeline.goTo(0);

            }, 200);
        }
    }
})();
