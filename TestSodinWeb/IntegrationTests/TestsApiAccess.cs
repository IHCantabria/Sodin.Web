using System;
using System.Collections.Generic;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SodinWeb.Api;
using SodinWeb.Models;
using SodinWeb.Repositories;

namespace TestSodinWeb.IntegrationTests
{
    [TestClass]
    public class TestsApiAccess
    {
        /* Api integration test against real data */

        private readonly EventsController _eventsController;
        private readonly TypesController _typesController;
        private readonly Repository _repository;
        private readonly ILogger<EventsController> _fakeLogger;
        private readonly ILogger<Repository> _fakeRepositoryLogger;

        public TestsApiAccess()
        {
            var builder = new ConfigurationBuilder()
                .AddJsonFile("tests_config.json");

            var config = builder.Build();
            _repository = new Repository(config, _fakeRepositoryLogger);
            _eventsController = new EventsController(_repository, _fakeLogger);
            _typesController = new TypesController(_repository, _fakeLogger);
        }

        [TestMethod]
        public void TestAuthentication()
        {

            var result = _eventsController.Get("", "2000-07-14 12:12",
                DateTime.UtcNow.ToShortDateString());
            Assert.IsNotInstanceOfType(result, typeof(BadRequestObjectResult));

        }

        [TestMethod]
        public void ReturnsACollectionOfPostEvents()
        {
            var postEventsList = GetAllPostEvents();
            Assert.IsTrue(postEventsList != null);
            Assert.IsTrue(postEventsList.Count > 0);
        }

        [TestMethod]
        public void ReturnedPostEventsHasRelatedStations()
        {
            var postEventsList = GetAllPostEvents();
            foreach (var postEvent in postEventsList)
            {
                Assert.IsTrue(postEvent.Station != null && postEvent.Station.StationId == postEvent.StationId);
            }
        }

        [TestMethod]
        public void ReturnAPostEvent()
        {
            var postEventsList = GetAllPostEvents();

            var resultEvent = _eventsController.Get(postEventsList[0].EventId);
            Assert.IsInstanceOfType(resultEvent, typeof(OkObjectResult));
            var postEventResult = (resultEvent as OkObjectResult)?.Value;
            var postEvent = postEventResult as PostEvent;

            Assert.IsTrue(postEvent != null && postEvent.EventId == postEventsList[0].EventId);
        }

        [TestMethod]
        public void MeasuresOfPostEventHaveStations()
        {
            var postEventsList = GetAllPostEvents();

            var resultEvent = _eventsController.Get(postEventsList[0].EventId);
            Assert.IsInstanceOfType(resultEvent, typeof(OkObjectResult));
            var postEventResult = (resultEvent as OkObjectResult)?.Value;
            var postEvent = postEventResult as PostEvent;

            foreach (var measure in postEvent.Measures)
            {
                Assert.IsNotNull(measure.StationId);
            }
        }

        [TestMethod]
        public void MeasuresOfPostEventHaveVariable()
        {
            var postEventsList = GetAllPostEvents();

            var resultEvent = _eventsController.Get(postEventsList[0].EventId);
            Assert.IsInstanceOfType(resultEvent, typeof(OkObjectResult));
            var postEventResult = (resultEvent as OkObjectResult)?.Value;
            var postEvent = postEventResult as PostEvent;

            foreach (var measure in postEvent.Measures)
            {
                Assert.IsNotNull(measure.Variable);
                Assert.IsTrue(measure.Variable.Code == measure.VariableCode);
            }
        }

        [TestMethod]
        public void ReturnsErrorOnBadRequest()
        {
            var result = _eventsController.Get("", DateTime.UtcNow.ToShortDateString(), "2000-07-14 12:12");
            Assert.IsInstanceOfType(result, typeof(BadRequestObjectResult));
        }

        [TestMethod]
        public void ReturnsErrorOnBadDateFormat()
        {
            var result = _eventsController.Get("", "2000-07-BadDay 12:12", DateTime.UtcNow.ToShortDateString());
            Assert.IsInstanceOfType(result, typeof(BadRequestObjectResult));
        }

        [TestMethod]
        public void ReturnsEventTypes()
        {
            var result = _typesController.Get();
            Assert.IsInstanceOfType(result, typeof(OkObjectResult));

            var objectResult = (result as OkObjectResult)?.Value;
            var eventTypes = objectResult as List<EventType>;
            Assert.IsTrue(eventTypes != null);
            Assert.AreEqual(eventTypes.Count, 2);
            Assert.IsTrue(!string.IsNullOrEmpty(eventTypes[0].Name));
        }

        private List<PostEvent> GetAllPostEvents()
        {
            var result = _eventsController.Get("", "2000-07-14 12:12",
                DateTime.UtcNow.ToShortDateString());
            Assert.IsInstanceOfType(result, typeof(OkObjectResult));
            var objectResult = (result as OkObjectResult)?.Value;

            var postEventsList = objectResult as List<PostEvent>;
            return postEventsList;
        }
    }
}
