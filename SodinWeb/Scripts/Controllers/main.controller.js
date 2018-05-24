(function () {
    'use strict';

    angular
        .module('sodinApp')
        .controller('MainCtrl', MainCtrl);

    MainCtrl.$inject = ['FactoryEvents', 'Main', 'SODIN_CONFIG', '$location'];

    function MainCtrl(FactoryEvents, Main, SODIN_CONFIG, $location) {
        /* jshint validthis:true */
        const vm = this;
        vm.activeEvent = FactoryEvents.data.activeEvent;
        vm.activeMenu = Main.data.activeMenu;
        vm.isOnlyWithPhotos = FactoryEvents.data.isOnlyWithPhotos;
        vm.menuItems = Main.data.menuItems;
        vm.utils = Main.data;
        vm.setActiveMenu = Main.setActiveMenu;
        vm.goToEvent = goToEvent;
        vm.version = vm.version = SODIN_CONFIG.VERSION;

        activate();

        function activate() {
            Main.setActiveMenu(0);
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
