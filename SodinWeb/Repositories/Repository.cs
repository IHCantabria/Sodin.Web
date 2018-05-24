using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using SodinWeb.Models;
using SodinWeb.Repositories;

namespace SodinWeb.Repositories
{
    public class Repository : IRepository
    {
        private readonly IMongoClient _client;
        private readonly IMongoDatabase _dbContext;
        private readonly IConfigurationRoot _config;
        private ILogger<Repository> _logger;

        public Repository(IConfigurationRoot config, ILogger<Repository> logger)
        {
            _config = config;
            _client = new MongoClient(_config["MongoDb:connection"]);
            _dbContext = _client.GetDatabase(_config["MongoDb:name"]);
            _logger = logger;
        }

        public bool CheckConnection()
        {
            var db = _client.GetDatabase(_config["MongoDb:name"]);
            return db != null;
        }

        public IEnumerable<PostEvent> GetPostEvents(string type, DateTime ini, DateTime end)
        {
            var postEventsCollection = IAsyncCursorSourceExtensions.ToList((from e in _dbContext.GetCollection<PostEvent>("postEventos").AsQueryable()
                                                                            where e.IniDate >= ini && e.IniDate <= end
                                                                            select e).OrderByDescending(e => e.IniDate));

            /* Add station class to each postEvent */
            foreach (var postEvent in postEventsCollection)
            {
                postEvent.Station = GetStation(postEvent.StationId);
            }

            if (!string.IsNullOrEmpty(type))
            {
                return postEventsCollection.FindAll(e => e.Type.Equals(type));
            }
            return postEventsCollection;
        }

        public PostEvent GetPostEvent(string eventId)
        {
            var collection = _dbContext.GetCollection<PostEvent>("postEventos");
            var postEvent = IAsyncCursorSourceExtensions.FirstOrDefault((from p in collection.AsQueryable()
                                                                         where p.EventId == eventId
                                                                         select p));

            /* Add station class to the postEvent */
            postEvent.Station = GetStation(postEvent.StationId);

            /* Add variable classes to each measure */
            var distinctVariables = postEvent.Measures
                .Select(m => new { m.VariableCode })
                .Distinct();

            var variables = distinctVariables.Select(m => GetVariable(m.VariableCode)).ToList();

            foreach (var measure in postEvent.Measures)
            {
                measure.Variable = variables.FirstOrDefault(v => v.Code == measure.VariableCode);
            }
            return postEvent;
        }

        private Variable GetVariable(int variableCode)
        {
            var collection = _dbContext.GetCollection<Variable>("variables");
            var variable = IAsyncCursorSourceExtensions.FirstOrDefault((from v in collection.AsQueryable()
                                                                        where v.Code == variableCode
                                                                        select v));
            return variable;
        }

        private Station GetStation(string stationId)
        {
            var collection = _dbContext.GetCollection<Station>("estaciones");
            var station = IAsyncCursorSourceExtensions.FirstOrDefault((from s in collection.AsQueryable()
                                                                       where s.StationId == stationId
                                                                       select s));
            if (station == null)
            {
                return null;
            }

            /* Add station class to the postEvent */
            station.Confederation = GetConfederation(station.ConfederationCode);
            return station;
        }

        private Confederation GetConfederation(double confederationCode)
        {
            var collection = _dbContext.GetCollection<Confederation>("confederaciones");
            var confederation = IAsyncCursorSourceExtensions.FirstOrDefault((from c in collection.AsQueryable()
                                                                             where c.Code == confederationCode
                                                                             select c));
            return confederation;
        }

        public List<EventType> GetEventTypes()
        {
            var collection = _dbContext.GetCollection<EventType>("tiposEvento");
            return IAsyncCursorSourceExtensions.ToList((from e in collection.AsQueryable()
                                                        select e));
        }
    }
}
