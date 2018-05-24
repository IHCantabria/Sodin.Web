using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson.Serialization.Attributes;

namespace SodinWeb.Models
{
    [BsonIgnoreExtraElements]
    public class Measure
    {
        [BsonElement("idEstacion")]
        public string StationId { get; set; }

        [BsonElement("fecha")]
        public DateTime Date { get; set; }

        [BsonElement("codigoVariable")]
        public int VariableCode { get; set; }

        [BsonElement("valor")]
        public double Value { get; set; }

        [BsonIgnore]
        public Variable Variable { get; set; }
    }
}
