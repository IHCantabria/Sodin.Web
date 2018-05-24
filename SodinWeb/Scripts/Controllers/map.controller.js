(function () {
    'use strict';

    angular
        .module('sodinApp')
        .controller('MapCtrl', MapCtrl);

    MapCtrl.$inject = ['FactoryEvents'];

    function MapCtrl(FactoryEvents) {
        /* jshint validthis:true */
        const vm = this;

        vm.center = FactoryEvents.data.mapCenter;
        vm.controls = {
            custom: new L.Control.Fullscreen()
        };
        vm.events = { // {} all events
            markers: { enable: ['dragend'] }
        };
        vm.defaults = {
            fadeAnimation: true,
            scrollWheelZoom: true,
            zoomAnimation: true,
            zoomControlPosition: 'topleft'
        };

        vm.layers =
            {
                baselayers: {
                    xyz: {
                        name: 'Carto Light (XYZ)',
                        url: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
                        options: {
                            attribution:
                                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy;' +
                                ' <a href="http://cartodb.com/attributions">CartoDB</a>',
                            subdomains: 'abcd',
                            maxZoom: 19
                        },
                        layerParams: { showOnSelector: false },
                        type: 'xyz'
                    }
                },
                overlays: {
                    rFloodingT10: {
                        name: 'Peligrosidad por Inundación Fluvial (T= 10 años)',
                        type: 'wms',
                        url: 'http://servicios.idee.es/wms-inspire/riesgos-naturales/inundaciones',
                        visible: false,
                        layerOptions: {
                            layers: 'NZ.Flood.FluvialT10',
                            format: 'image/png',
                            opacity: 0.50,
                            attribution: 'Ministerio de Agricultura y Pesca, Alimentación y' +
                                ' Medio Ambiente (MAPAMA). http://www.mapama.gob.es',
                            crs: L.CRS.EPSG4326
                        }
                    },
                    rFloodingT100: {
                        name: 'Peligrosidad por Inundación Fluvial (T= 100 años)',
                        type: 'wms',
                        url: 'http://servicios.idee.es/wms-inspire/riesgos-naturales/inundaciones',
                        visible: false,
                        layerOptions: {
                            layers: 'NZ.Flood',
                            format: 'image/png',
                            opacity: 0.50,
                            attribution: 'Ministerio de Agricultura y Pesca, Alimentación y ' +
                                'Medio Ambiente (MAPAMA). http://www.mapama.gob.es',
                            crs: L.CRS.EPSG4326
                        }
                    },
                    rFloodingT500: {
                        name: 'Peligrosidad por Inundación Fluvial (T= 500 años)',
                        type: 'wms',
                        url: 'http://servicios.idee.es/wms-inspire/riesgos-naturales/inundaciones',
                        visible: false,
                        layerOptions: {
                            layers: 'NZ.Flood.FluvialT500',
                            format: 'image/png',
                            opacity: 0.50,
                            attribution: 'Ministerio de Agricultura y Pesca, Alimentación y' +
                                ' Medio Ambiente (MAPAMA). http://www.mapama.gob.es',
                            crs: L.CRS.EPSG4326
                        }
                    },
                    cFloodingT100: {
                        name: 'Peligrosidad por Inundación Costera (T= 100 años)',
                        type: 'wms',
                        url: 'http://servicios.idee.es/wms-inspire/riesgos-naturales/inundaciones',
                        visible: false,
                        layerOptions: {
                            layers: 'NZ.Flood.MarinaT100',
                            format: 'image/png',
                            opacity: 0.50,
                            attribution: 'Ministerio de Agricultura y Pesca, Alimentación y' +
                                ' Medio Ambiente (MAPAMA). http://www.mapama.gob.es',
                            crs: L.CRS.EPSG4326
                        }
                    },
                    cFloodingT500: {
                        name: 'Peligrosidad por Inundación Costera (T= 500 años)',
                        type: 'wms',
                        url: 'http://servicios.idee.es/wms-inspire/riesgos-naturales/inundaciones',
                        visible: false,
                        layerOptions: {
                            layers: 'NZ.Flood.MarinaT500',
                            format: 'image/png',
                            opacity: 0.50,
                            attribution: 'Ministerio de Agricultura y Pesca, Alimentación y' +
                                ' Medio Ambiente (MAPAMA). http://www.mapama.gob.es',
                            crs: L.CRS.EPSG4326
                        }
                    }
                }
            };
        vm.markers = FactoryEvents.data.eventsMarkers;

        activate();

        function activate() {

        }
    }
})();
