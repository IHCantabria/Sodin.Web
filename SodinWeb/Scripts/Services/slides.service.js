(function () {
    'use strict';

    angular
        .module('sodinApp')
        .factory('FactorySlides', FactorySlides);

    function FactorySlides() {
        /* Private variables */
        var slides = {
            intro: {},
            data: []
        };

        /* Factory Object */
        const factory = {};

        factory.data = {
            slides: slides
        };

        factory.createEventSlides = createEventSlides;

        return factory;

        ///////////////

        function createEventSlides(event) {
            const introSlide = createIntroSlide(event);
            const slidesTweets = createTweetsSlides(event);
            const slidesMeasures = createInSituDataSlides(event);
            const dataSlides = _.union(slidesTweets, slidesMeasures);

            slides.intro = introSlide;
            slides.data.length = 0;
            slides.data.push.apply(slides.data, dataSlides);
        }

        function createIntroSlide(event) {
            return {
                'media': {
                    'url': `<iframe style="border:0;" src="iframes/eventMap.html?eventParameters=${encodeURIComponent(JSON.stringify(event.eventId))}"></iframe>`
                },
                'text': {
                    'headline': '',
                    'text': getIntroHtml(event)
                }
            };
        }

        function getIntroHtml(event) {
            const iniDateFormatted = moment(event.iniDate).format('DD-MM-YYYY HH:mm');
            const endDateFormatted = moment(event.endDate).format('DD-MM-YYYY HH:mm');
            const tweetsConFoto = event.tweets.filter(tweet => tweet.pictureData !== null);
            const tipo = event.type === 'Fluvial' ? 'Inundación Fluvial' : 'Inundación Costera';
            return `<div class="row"><div class="col s12 no-padding"><div class="card"><div class="card-content">
                    <span class="card-title">${event.place}</span>                    
                    <div><label class="card-subtitle"> ${tipo}</label></div>          
                    <div class="padding-top"><label> Confederación: </label></div>
                    <div><label class="card-label"> ${event.station.confederation.name}</label></div>
                    <div class="padding-card"><label> Sistema: </label></div>
                    <div><label class="card-label"> ${event.station.system}</label></div>
                    <div class="padding-top"><label> Datos capturados: </label></div>
                    <div class="padding-card"><span class="new badge blue badgets-card-left"
                    data-badge-caption="medidas in situ">${event.measures.length}</span>
                    <span class="new badge blue badgets-card-left" data-badge-caption="tweets">${event.tweets.length}</span>
                    <span class="new badge blue badgets-card-left" data-badge-caption="fotos">${tweetsConFoto.length}</span>
                    </div><div class="padding-top" style="clear:left;"><div><label> Posición: </label></div>
                    <div class="padding-card"><div class="chip">Longitud: ${event.coords.lon.toFixed(4)}</div><div class="chip">
                    Latitud: ${event.coords.lat.toFixed(4)}</div>
                    </div></div><div class="padding-top"><div><label> Fechas inicio y fin: </label></div></span>
                    <div class="padding-card" style="margin-bottom:20px;"><span class="new badge badgets-card-left"
                    data-badge-caption="">${iniDateFormatted}</span> 
                    <span class="new badge badgets-card-left" data-badge-caption="">${endDateFormatted}</span></div></div>`;
        }

        /** Tweets Slides **/

        function createTweetsSlides(event) {
            const slidesTweets = [];
            for (let i = 0; i < event.tweets.length; i++) {
                slidesTweets.push(getTweetSlide(event.tweets[i]));
            }
            return slidesTweets;
        }

        function getTweetSlide(tweet) {
            const htmlTweetText = getTweetTextHtml(tweet);
            const tweetDate = moment(tweet.metadata.fecha_creacion, 'ddd MMM DD HH:mm:ss Z YYYY').utc().add(1, 'M');

            return {
                'media': {
                    'url': tweet.pictureData !== null ? tweet.pictureData.url : '',
                    'caption': tweet.pictureData !== null ? getTweetPhotoHtml(tweet) : '',
                    'thumbnail': 'images/Twitter_Logo_White_On_Blue.png'
                },
                'start_date': {
                    'year': tweetDate.year().toString(),
                    'month': tweetDate.month().toString(),
                    'day': tweetDate.date().toString(),
                    'hour': tweetDate.hour().toString(),
                    'minute': tweetDate.minute().toString()
                },
                'text': {
                    'headline': tweet.pictureData !== null ?
                        '<i class="fa fa-camera timelineNavIcos" aria-hidden="true"></i> RRSS'
                        : '<div class="timelineNavIcos">RRSS</div>',
                    'text': htmlTweetText
                },
                'unique_id': tweet.tweetId,
                'group': 'RRSS'
            };
        }

        function getTweetTextHtml(tweet) {
            const keyWords = tweet.textData.palabras_clave;
            const feeling = Math.round(tweet.textData.sentimiento * 100);
            const account = tweet.textData.account ? `@${tweet.textData.account}` : '?';
            const isVerified = tweet.textData.verified ? tweet.textData.verified : false;
            const htmlVerifiedAccount = isVerified ?
                `<span class="fa fa-stack twitter-blue" title="Cuenta verificada">
                    <i class="fa fa-certificate fa-stack-2x"></i><i class="fa fa-check fa-stack-1x fa-inverse"></i></span>` : '';

            var htmlHastags = '',
                htmlKeyWords = '';
            const icoFeeling = getFeelingIco(feeling);

            for (let i = 0; i < tweet.metadata.hashtags.length; i++) {
                htmlHastags += `<div class="chip">${tweet.metadata.hashtags[i].text}</div>`;
            }

            for (let x = 0; x < keyWords.length; x++) {
                htmlKeyWords += `<div class="chip">${keyWords[x]}</div>`;
            }

            return `<div class="row"><div class="col s12 no-padding"><div class="card">
                <div class="card-content"><p>${tweet.textData.texto}</p><div class="padding-top"><label> Cuenta:</label></div>
                <div class="padding-card"><div class="chip">${account}</div>${htmlVerifiedAccount}</div>
                <div class="padding-top"><label> Hashtags:</label></div><div class="padding-card">${htmlHastags}</div>
                <div class="badgets-card"><span class="new badge blue" data-badge-caption="likes">${tweet.metadata.n_likes}</span>
                <span class="new badge blue" data-badge-caption="retweets">${tweet.metadata.n_retweets}</span></div></div>
                <div class="card-content border-card"><span class="card-title">Análisis Texto</span>
                <label>Palabras clave detectadas:</label><div class="padding-card">${htmlKeyWords}</div>
                <div class="badgets-card"><span class="new badge"
                data-badge-caption="">Sentimiento captado --- <i title="${feeling}%" class="${icoFeeling}" aria-hidden="true"></i>
                </span></div></div><div class="card-action" style="text-align:right">
                <a href="https://twitter.com/statuses/${tweet.tweetId}" target="_blank">Ver tweet original</a></div></div></div></div>`;
        }

        function getTweetPhotoHtml(tweet) {
            const description = tweet.pictureData.description.captions[0].text;
            const tags = tweet.pictureData.tags;
            var htmlTags = '';

            for (let i = 0; i < tags.length; i++) {
                htmlTags += `<div class="chip">${tags[i].name}</div>`;
            }

            return `<div class="row"><div class="col s12 no-padding"><div class="card"><div class="card-content">
                    <span class="card-title">Análisis Foto</span><label> Descripción: </label>
                    <p class="font-card padding-card">${description}</p><div class="padding-top"><div><label> Etiquetas: </label>
                    </div><div class="padding-card">${htmlTags}</div></div></div>`;
        }

        function getFeelingIco(feelingValue) {
            if (feelingValue < 25) {
                return 'fa fa-frown-o fa-lg';
            } else if (feelingValue > 75) {
                return 'fa fa-smile-o fa-lg';
            }
            return 'fa fa-meh-o fa-lg';
        }

        /** In Situ Data Slides **/

        function createInSituDataSlides(event) {
            const slidesMeasures = [];
            const sortedMeasures = _.sortBy(event.measures, 'date');
            const groupedMeasures = groupMeasuresByPlaceAndTime(sortedMeasures);

            for (let x = 0; x < groupedMeasures.length; x++) {
                slidesMeasures.push(getInSituSlide(groupedMeasures[x], event, x));
            }
            return slidesMeasures;
        }

        function getInSituSlide(groupedMeasures, event, index) {
            const htmlMeasureText = getInSituTextHtml(groupedMeasures, event);
            const measureDate = moment(groupedMeasures[0].date).utc().add(1, 'M');
            const chartParameters = { eventId: event.eventId, pointIndex: index };

            return {
                'media': {
                    'url': `<iframe style="border:0;" src="iframes/eventChart.html?chartParameters=${encodeURIComponent(JSON.stringify(chartParameters))}"></iframe>`,
                    'caption': '',
                    'thumbnail': 'images/ic_multiline_chart_black_24dp_2x.png'
                },
                'start_date': {
                    'year': measureDate.year().toString(),
                    'month': measureDate.month().toString(),
                    'day': measureDate.date().toString(),
                    'hour': measureDate.hour().toString(),
                    'minute': measureDate.minute().toString()
                },
                'text': {
                    'headline': '<div class="timelineNavIcos"> In Situ</div>',
                    'text': htmlMeasureText
                },
                'group': 'Datos Sensores'
            };
        }

        function getInSituTextHtml(groupedMeasures, event) {
            const stationState = event.station.isActive ? 'ON' : 'OFF';
            var htmlData = '';

            _.each(groupedMeasures,
                function (data) {
                    const value = data.value;
                    const variableName = data.variable.name;
                    const variableUnits = data.variable.unit;
                    htmlData += `<div class="padding-card"><span>${variableName}: </span> <span class="new badge"
                    data-badge-caption=${variableUnits}>${value}</span></div>`;
                });

            return `<div class="row"><div class="col s12 no-padding"><div class="card"><div class="card-content">
                <span class="card-title">Estación</span><span>${event.station.name}</span>
                <span class="new badge green" data-badge-caption="">${stationState}</span><div class="padding-top">
                <div><label> Posición: </label></div><div class="padding-card"><div class="chip">Longitud: ${event.station.coords.lon}</div>
                <div class="chip">Latitud: ${event.station.coords.lat}</div></div></div></div><div class="card-content border-card">
                <span class="card-title">Datos</span>${htmlData}</div></div>`;
        }

        function groupMeasuresByPlaceAndTime(measures) {
            var groupedMeasures = [];

            const measuresAtSameTime = _.groupBy(measures,
                (measure) => { return measure.date; });

            _.each(measuresAtSameTime,
                (measuresGroup) => { groupedMeasures.push(_.uniq(measuresGroup, true, (m) => m.variableCode)); });

            return groupedMeasures;
        }

        /****/
    }
})();