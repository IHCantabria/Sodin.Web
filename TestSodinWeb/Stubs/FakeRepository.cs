using System;
using System.Collections.Generic;
using System.IO;
using MongoDB.Bson.Serialization;
using Newtonsoft.Json;
using SodinWeb.Models;
using SodinWeb.Repositories;

namespace TestSodinWeb.Stubs
{
    class FakeRepository : IRepository
    {
        public IEnumerable<PostEvent> GetPostEvents()
        {
            throw new NotImplementedException();
            
        }

        public PostEvent GetPostEvent(string eventId)
        {
            var fileName = $"PostEventBson_{eventId}.json";
            var fullPath = $@"C:\SVN\SODIN\SODIN_Web\src\TestSodinWeb\Stubs\FakeData\{fileName}";
            if (!File.Exists(fullPath))
            {
                return null;
            }

            using (var r = new StreamReader(fullPath))
            {
                var json = r.ReadToEnd();
                var postEvent = BsonSerializer.Deserialize<PostEvent>(json);
                return postEvent;
            }
        }

        public IEnumerable<PostEvent> GetPostEvents(string type, DateTime ini, DateTime end)
        {
            throw new NotImplementedException();
        }

        public List<EventType> GetEventTypes()
        {
            throw new NotImplementedException();
        }
    }
}
