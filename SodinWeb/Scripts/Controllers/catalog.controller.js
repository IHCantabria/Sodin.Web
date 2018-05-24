(function () {
    'use strict';

    angular
        .module('sodinApp')
        .controller('CatalogCtrl', CatalogCtrl);

    CatalogCtrl.$inject = ['$location', 'FactoryEvents', 'Main'];

    function CatalogCtrl($location, FactoryEvents, Main) {
        /* jshint validthis:true */
        const vm = this;
        vm.configTable = FactoryEvents.data.configTable;
        vm.events = FactoryEvents.data.events;
        vm.activeEvent = FactoryEvents.data.activeEvent;
        vm.selectEvent = FactoryEvents.selectEvent;
        vm.isOnlyWithPhotos = FactoryEvents.data.isOnlyWithPhotos;
        vm.setActiveMenu = Main.setActiveMenu;
        vm.goToEvent = goToEvent;

        activate();

        function activate() {

        }

        function goToEvent() {
            if (vm.activeEvent.eventId) {
                vm.setActiveMenu(1);
                $location.path(`/eventTimeline/${vm.activeEvent.eventId}/${vm.isOnlyWithPhotos.active}`);
            } else {
                window.Materialize.toast('You must select an event', 2000);
            }
        }
    }
})();
