using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson.Serialization.Attributes;

namespace SodinWeb.Models
{
    [BsonIgnoreExtraElements]
    public class ProcessTweet
    {
        [BsonElement("id_tweet")]
        public string TweetId { get; set; }

        [BsonElement("datos_foto")]
        public object PictureData { get; set; }

        [BsonElement("metadatos")]
        public object Metadata { get; set; }

        [BsonElement("datos_texto")]
        public object TextData { get; set; }
    }
}
