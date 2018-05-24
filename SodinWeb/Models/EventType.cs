using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SodinWeb.Models
{
    [BsonIgnoreExtraElements]
    public class EventType
    {
        [BsonElement("codigo")]
        public double Code { get; set; }

        [BsonElement("nombre")]
        public string Name { get; set; }
    }
}
