using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson.Serialization.Attributes;

namespace SodinWeb.Models
{
    [BsonIgnoreExtraElements]
    public class Confederation
    {
        [BsonElement("codigo")]
        public double Code { get; set; }

        [BsonElement("nombre")]
        public string Name { get; set; }

        [BsonElement("alias")]
        public string Alias { get; set; }
    }
}
