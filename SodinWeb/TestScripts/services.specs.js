
describe('Viewer services',
    function () {
        var mockedEvents;

        beforeEach(module('sodinApp'));

        beforeEach(inject(function ($httpBackend) {
            mockedEvents = [
                {
                    "eventId": '59285f4a5d933e22a00bfbe6',
                    "place": 'Carandia',
                    "type": 'Fluvial',
                    "coords": {
                        "lat": 43.356,
                        "lon": -7.18
                    },
                    "stationId": 'Q104',
                    "tweets": [],
                    "measures": [],
                    "date": '2017-05-28T10:01:00Z'
                },
                {
                    "eventId": '31242342352345634',
                    "place": 'Santander',
                    "type": 'Costero',
                    "coords": {
                        "lat": 44.356,
                        "lon": -3.18
                    },
                    "stationId": 'Q104',
                    "tweets": [],
                    "measures": [],
                    "date": '2017-04-28T10:01:00Z'
                }
            ];

            //Reg exp in the url expected to let httpbackend accept the url with or without params
            $httpBackend.whenGET(/.*?api\/events?.*/g)
                .respond(function (method, url, data, headers, params) {
                    if (params['type'] === 'Costero') {
                        return [200, [mockedEvents[1]]];
                    }
                    return [200, mockedEvents];
                });
        }));

        it('factory is defined', inject(function (FactoryEvents) {
                expect(FactoryEvents).toBeDefined();
            }));

        it('returns all mocked events', inject(function ($httpBackend, $http) {
                $http.get('api/events/',
                    {
                        cache: false,
                        params: {
                            initialUtcDate: '1900/01/15',
                            endUtcDate: '2017/06/22'
                        }
                    })
                    .then(function (response) {
                        expect(response.status).toBe(200);
                        expect(response.data.length).toEqual(2);
                    });
                $httpBackend.flush();
            }));

        it('returns mocked events filtered by type', inject(function ($httpBackend, $http) {
                $http.get('api/events/',
                    {
                        cache: false,
                        params: {
                            type: 'Costero',
                            initialUtcDate: '1900/01/15',
                            endUtcDate: '2017/06/22'
                        }
                    })
                    .then(function (response) {
                        expect(response.status).toBe(200);
                        expect(response.data.length).toEqual(1);
                        expect(response.data[0].type).toBe('Costero');
                    });
                $httpBackend.flush();
            }));

        it('update events catalog', inject(function (FactoryEvents) {
                FactoryEvents.updateEventsCatalog(mockedEvents);
                expect(FactoryEvents.data.events.length).toBeGreaterThan(1);
            }));

        it('create an event geomarker', inject(function (FactoryEvents) {
                var marker = FactoryEvents.createEventMarker(mockedEvents[0]);
                expect(marker.lat).toBeDefined();
                expect(marker.lng).toBeDefined();
                expect(marker.message).toBeDefined();
            }));

        it('set an event as active', inject(function (FactoryEvents) {
                FactoryEvents.activateEvent(mockedEvents[0]);
                expect(FactoryEvents.data.activeEvent).toEqual(mockedEvents[0]);
            }));

        it('center map on event', inject(function (FactoryEvents) {
            FactoryEvents.selectEvent(mockedEvents[0]);
            expect(FactoryEvents.data.mapCenter.lon).toBe(mockedEvents[0].coords.lng);
            expect(FactoryEvents.data.mapCenter.lat).toBe(mockedEvents[0].coords.lat);
            expect(FactoryEvents.data.activeEvent).toEqual(mockedEvents[0]);
        }));
    });
