using System;
using System.Collections.Generic;
using SodinWeb.Models;

namespace SodinWeb.Repositories
{
    public interface IRepository
    {
        IEnumerable<PostEvent> GetPostEvents(string type, DateTime ini, DateTime end);
        PostEvent GetPostEvent(string eventId);
        List<EventType> GetEventTypes();


    }
}
