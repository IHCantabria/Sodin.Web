using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson.Serialization.Attributes;

namespace SodinWeb.Models
{
    [BsonIgnoreExtraElements]
    public class Variable
    {
        [BsonElement("codigo")]
        public int Code { get; set; }

        [BsonElement("nombre")]
        public string Name { get; set; }

        [BsonElement("unidad")]
        public string Unit { get; set; }
    }
}
