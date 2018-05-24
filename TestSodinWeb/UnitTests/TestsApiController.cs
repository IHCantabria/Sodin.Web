using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SodinWeb.Api;
using SodinWeb.Models;
using TestSodinWeb.Stubs;

namespace TestSodinWeb.UnitTests
{
    
    [TestClass]
    
    public class TestsApiController
    {
        private readonly EventsController _controller;
        private readonly FakeRepository _fakeRepository = new FakeRepository();
        private readonly ILogger<EventsController> _fakeLogger;

        public TestsApiController()
        {
            _controller = new EventsController(_fakeRepository, _fakeLogger);
        }

        [TestMethod]
        public void ReturnsAPostEvent()
        {
            const string id = "596f94ac69083535b4caa261";
            var result = _controller.Get(id);
            Assert.IsInstanceOfType(result, typeof(OkObjectResult));
            var objectResult = (result as OkObjectResult)?.Value;
            Assert.IsInstanceOfType(objectResult, typeof(PostEvent));
        }

        [TestMethod]
        public void PostEventNotExists()
        {
            var result = _controller.Get("99");
            Assert.IsInstanceOfType(result, typeof(NotFoundResult));
        }

        [TestMethod]
        public void PostEventSerializationIsValid()
        {
            const string id = "596f94ac69083535b4caa261";
            const string eventId = "596f941069083535b4caa25c";
            var result = _controller.Get(id);
            var objectResult = (result as OkObjectResult)?.Value;
            var postEvent = objectResult as PostEvent;
            Assert.IsNotNull(postEvent);
            Assert.AreEqual(postEvent.EventId, eventId);
            Assert.IsTrue(postEvent.Tweets.Count > 0);
            Assert.IsTrue(postEvent.Measures.Count > 0);
            Assert.IsInstanceOfType(postEvent.IniDate, typeof(DateTime));
            CheckTweetSerialization(postEvent.Tweets[0]);
            CheckMeasuresSerialization(postEvent.Measures[0]);
        }

        [TestMethod]
        public void ParseADate()
        {
            const string testDate = "2017/04/19 01:30";
            var dateParsed = _controller.ParseInitialDate(testDate);
            Assert.IsInstanceOfType(dateParsed, typeof(DateTime));
        }

        [TestMethod]
        public void TryToParseABadFormattedDateReturnsException()
        {
            const string testBadFormattedDate = "2017/04/Wednesday 01:30";
            Assert.ThrowsException<Exception>(() => _controller.ParseInitialDate(testBadFormattedDate));
        }

        private void CheckTweetSerialization(ProcessTweet tweet)
        {
            Assert.IsInstanceOfType(tweet.TweetId, typeof(string));
            Assert.IsNotNull(tweet.Metadata);
            Assert.IsNotNull(tweet.TextData);
        }

        private void CheckMeasuresSerialization(Measure measure)
        {
            Assert.IsFalse(string.IsNullOrEmpty(measure.StationId));
            Assert.IsInstanceOfType(measure.StationId, typeof(string));
            Assert.IsInstanceOfType(measure.Date, typeof(DateTime));
            Assert.IsInstanceOfType(measure.VariableCode, typeof(int));
            Assert.IsInstanceOfType(measure.Value, typeof(double));
        }


    }
}
