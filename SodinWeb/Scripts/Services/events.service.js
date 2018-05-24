(function () {
    'use strict';

    angular
        .module('sodinApp')
        .factory('FactoryEvents', FactoryEvents);

    FactoryEvents.$inject = ['$http', 'NgTableParams', 'Main'];

    function FactoryEvents($http, NgTableParams, Main) {
        /* Private variables */
        const eventFilter = {},
            isOnlyWithPhotos = { active: false },
            fluvial = 'Fluvial',
            coastal = 'Costero';

        var activeEvent = {},
            configTable = new NgTableParams({ count: 5 }, { counts: [] }),
            events = [],
            eventsMarkers = [],
            filters = {
                type: {
                    isCoastal: false,
                    isRiver: true
                },
                date: {
                    lastDays: 0,
                    iniDate: {},
                    endDate: {}
                }
            },
            mapCenter = {},
            urlSodinApi = 'api/events/';

        /* Factory Object */
        const factory = {};

        factory.data = {
            activeEvent: activeEvent,
            configTable: configTable,
            filters: filters,
            eventFilter: eventFilter,
            events: events,
            eventsMarkers: eventsMarkers,
            isOnlyWithPhotos: isOnlyWithPhotos,
            mapCenter: mapCenter
        };

        factory.activateEvent = activateEvent;
        factory.createEventMarker = createEventMarker;
        factory.filterEvents = filterEvents;
        factory.loadEvent = loadEvent;
        factory.getEvents = getEvents;
        factory.selectEvent = selectEvent;
        factory.setMapCenter = setMapCenter;
        factory.updateEventsCatalog = updateEventsCatalog;

        return factory;

        ///////////////

        function activateEvent(event) {
            angular.copy(event, activeEvent);
        }

        function clearEvents() {
            events.length = 0;
            updateEventsGeoMarkers();
            updateConfigTable();
        }

        function createEventMarker(event) {
            var marker = null;

            if (event.coords.lon !== null && event.coords.lat !== null) {
                const lat = parseFloat(event.coords.lat);
                const lon = parseFloat(event.coords.lon);
                if (!isNaN(event.coords.lon) && !isNaN(event.coords.lat)) {
                    marker = {
                        lat: lat,
                        lng: lon,
                        message: event.place,
                        icon: {
                            type: 'awesomeMarker', prefix: 'fa', markerColor: event.type === coastal ? 'darkred' : 'cadetblue',
                            icon: event.type === coastal ? 'life-saver' : 'tint',
                            spin: false
                        }
                    };
                }
            }
            return marker;
        }

        function loadEvent(id, photoFilterIsActive) {
            return new Promise((resolve) => {
                $http.get(urlSodinApi + id, { cache: false })
                    .then(function (response) {
                        const event = photoFilterIsActive ?
                            filterTweetsWithoutPhoto(response.data) : response.data;
                        selectEvent(event);
                        resolve();
                    },
                    function (error) {
                        console.log(`Error getting event: ${error.data}`);
                    });
            });
        }

        function getEvents(type, iniUtc, endUtc) {
            Main.activateProgressBar('Getting events...');
            $http.get(urlSodinApi, {
                cache: false,
                params: {
                    type: type,
                    initialUtcDate: iniUtc,
                    endUtcDate: endUtc
                }
            }).then((response) => {
                updateEventsCatalog(response.data);
                Main.disableProgressBar('');
            }, (error) => {
                console.log(`Error getting events: ${error.data}`);
            });
        }

        function filterEvents(filter) {
            if (!filter.type.isCoastal && !filter.type.isRiver) {
                clearEvents();
                return;
            }

            const timeFilter = getTimeFilter(filter);
            const typeFilter = getTypeFilter(filter);
            getEvents(typeFilter, timeFilter.iniDate, timeFilter.endDate);
        }

        function getTimeFilter(filter) {
            let iniDate = moment().utc();
            const endDate = moment().utc().add(1, 'd').format('YYYY-MM-DD'); //(ie: 2017-06-28)

            iniDate = filters.date.lastDays === 0
                ? null
                : iniDate.subtract(filter.date.lastDays, 'd').format('YYYY-MM-DD');
            return { iniDate: iniDate, endDate: endDate };
        }

        function getTypeFilter(filter) {
            let type = '';

            if (filter.type.isCoastal && !filter.type.isRiver) {
                type = coastal;
            }
            else if (!filter.type.isCoastal && filter.type.isRiver) {
                type = fluvial;
            }
            return type;
        }

        function filterTweetsWithoutPhoto(event) {
            event.tweets = event.tweets.filter(tweet => tweet.pictureData !== null);
            return event;
        }

        function selectEvent(event) {
            activateEvent(event);
            setMapCenter(event.coords.lon, event.coords.lat, 10);
        }

        function setMapCenter(lon, lat, zoom) {
            mapCenter.lng = lon;
            mapCenter.lat = lat;
            mapCenter.zoom = zoom;
        }

        function updateEventsCatalog(newEvents) {
            events.length = 0;
            events.push.apply(events, newEvents);
            updateEventsGeoMarkers();
            updateConfigTable();
        }

        function updateEventsGeoMarkers() {
            eventsMarkers.length = 0;
            events.map(function (event) {
                const eventMarker = createEventMarker(event);
                if (eventMarker !== null) {
                    eventsMarkers.push(eventMarker);
                }
            });
        }

        function updateConfigTable() {
            /* Configuration of table pagination and sorting */
            configTable.settings({ dataset: events });
            configTable.total(events.length);
            configTable.reload();
        }
    }
})();