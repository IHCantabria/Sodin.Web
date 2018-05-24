using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson.Serialization.Attributes;

namespace SodinWeb.Models
{
    [BsonIgnoreExtraElements]
    public class PostEvent
    {
        [BsonElement("idEvento")]
        public string EventId { get; set; }

        [BsonElement("tipo")]
        public string Type { get; set; }

        [BsonElement("idEstacion")]
        public string StationId { get; set; }

        [BsonElement("lugar")]
        public string Place { get; set; }

        [BsonElement("coords")]
        public object Coords { get; set; }

        [BsonElement("tweets")]
        public List<ProcessTweet> Tweets { get; set; }

        [BsonElement("medidas")]
        public List<Measure> Measures { get; set; }

        [BsonElement("fechaInicio")]
        public DateTime IniDate { get; set; }

        [BsonElement("fechaFin")]
        public DateTime EndDate { get; set; }

        [BsonIgnore]
        public Station Station { get; set; }
    }
}
