using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson.Serialization.Attributes;

namespace SodinWeb.Models
{
    [BsonIgnoreExtraElements]
    public class Station
    {
        [BsonElement("id")]
        public string StationId { get; set; }

        [BsonElement("codigo")]
        public string Code { get; set; }

        [BsonElement("codigoConfederacion")]
        public double ConfederationCode { get; set; }

        [BsonElement("activa")]
        public bool IsActive { get; set; }

        [BsonElement("coordenadas")]
        public object Coords { get; set; }

        [BsonElement("nombre")]
        public string Name { get; set; }

        [BsonElement("sistema")]
        public string System { get; set; }

        [BsonIgnore]
        public Confederation Confederation { get; set; }
    }
}
