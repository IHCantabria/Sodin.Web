(function () {
    'use strict';

    angular
        .module('sodinApp')
        .factory('Main', Main);

    function Main() {
        /* Private variables */
        var activeMenu = {},
            menuItems = [{ id: 0, name: 'Visor' }, { id: 1, name: 'Event' }, { id: 2, name: 'About' }];

        /* Factory Object */
        const factory = {},
            progressBar = { state: false, msg: '', activate: function (state) { this.state = state; } };

        factory.data = {
            activeMenu: activeMenu,
            progressBar: progressBar,
            menuItems: menuItems
        };

        factory.activateProgressBar = activateProgressBar;
        factory.disableProgressBar = disableProgressBar;
        factory.setActiveMenu = setActiveMenu;

        return factory;

        ///////////////

        function activateProgressBar(msg) {
            progressBar.activate(true);
            progressBar.msg = msg;
            //console.log(msg); //for debug
        }

        function disableProgressBar(_) {
            progressBar.activate(false);
            //console.log(msg);//for debug
        }

        function setActiveMenu(index) {
            angular.copy(menuItems[index], activeMenu);
        }
    }
})();