using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SodinWeb.Repositories;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SodinWeb.Api
{
    [Route("api/[controller]")]
    public class EventsController : Controller
    {
        public readonly IRepository _repository;
        private readonly ILogger<EventsController> _logger;

        public EventsController(IRepository repository, ILogger<EventsController> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        [HttpGet]
        public IActionResult Get(string type, string initialUtcDate, string endUtcDate)
        {
            /* Validation for input dates:             
            FechaIni == empty or null ==> Events from 1900 until EndDate 
            FechaFin == empty or null ==> Events from InitialDate until Today */
            try
            {
                var parsedIniUtcDate = ParseInitialDate(initialUtcDate);
                var parsedEndUtcDate = ParseEndDate(endUtcDate);

                if (parsedEndUtcDate < parsedIniUtcDate)
                {
                    return BadRequest("'EndUtcDate' must be posterior to 'InitialUtcDate'.");
                }
                /* For type == empty or null, returns events of all types */
                var postEvents = _repository.GetPostEvents(type, parsedIniUtcDate, parsedEndUtcDate);
                return (postEvents == null) ? (IActionResult)NotFound() : Ok(postEvents);
                
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public IActionResult Get(string id)
        {
            try
            {
                var postEvent = _repository.GetPostEvent(id);
                if (postEvent == null)
                {
                    return NotFound();
                }
                return Ok(postEvent);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting a PostEvent from MongoDb database. {ex}");
                return BadRequest("Error getting a PostEvent from MongoDb database");
            }
        }

        public DateTime ParseInitialDate(string initialUtcDate)
        {
            if (string.IsNullOrEmpty(initialUtcDate))
                return new DateTime(1900, 01, 01);


            if (DateTime.TryParse(initialUtcDate, out DateTime parsedIniUtcDate))
            {
                return parsedIniUtcDate;
            }
            throw new Exception("Not a valid date format. Try another format (ie: 'YYYY-MM-dd hh:mm')");
        }

        public DateTime ParseEndDate(string endUtcDate)
        {
            if (string.IsNullOrEmpty(endUtcDate))
                return DateTime.UtcNow;

            if (DateTime.TryParse(endUtcDate, out DateTime parsedEndUtcDate))
            {
                return parsedEndUtcDate;
            }
            throw new Exception("Not a valid date format. Try another format (ie: 'YYYY-MM-dd hh:mm')");
        }
    }
}
