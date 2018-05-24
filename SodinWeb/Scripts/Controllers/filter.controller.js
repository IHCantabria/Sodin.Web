(function () {
    'use strict';

    angular
        .module('sodinApp')
        .controller('FilterCtrl', FilterCtrl);

    FilterCtrl.$inject = ['$scope', 'FactoryEvents'];

    function FilterCtrl($scope, FactoryEvents) {
        /* jshint validthis:true */
        var vm = this;
        const chc = { lat: 43.2812044, lng: -3.994903564, zoom: 6 };
        vm.fluvial = 'Fluvial';
        vm.coastal = 'Costero';

        vm.checkSwitchState = checkSwitchState;
        vm.eventsFilter = FactoryEvents.data.filters;

        activate();

        function activate() {
            if (FactoryEvents.data.events.length === 0) { //First load
                FactoryEvents.filterEvents(vm.eventsFilter);
                FactoryEvents.setMapCenter(chc.lng, chc.lat, chc.zoom);
            }
        }

        function checkSwitchState(type) {
            switch (type) {
                case vm.coastal:
                    if (vm.eventsFilter.type.isRiver === false) {
                        vm.eventsFilter.type.isCoastal = true;
                    }
                    break;
                case vm.fluvial:
                    if (vm.eventsFilter.type.isCoastal === false) {
                        vm.eventsFilter.type.isRiver = true;
                    }
            }
        }

        $scope.$watch('filter.eventsFilter', function (filter, oldFilter) {
            if (typeof filter === 'undefined') return;

            if (!angular.equals({}, filter) && !Object.is(filter, oldFilter)) {
                FactoryEvents.filterEvents(filter);
            }
        }, true);
    }
})();
