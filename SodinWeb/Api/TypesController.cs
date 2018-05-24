using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SodinWeb.Repositories;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SodinWeb.Api
{
    [Route("api/[controller]")]
    public class TypesController : Controller
    {
        public readonly IRepository _repository;
        private readonly ILogger<EventsController> _logger;

        public TypesController(IRepository repository, ILogger<EventsController> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                var eventTypes = _repository.GetEventTypes();
                if (eventTypes == null)
                {
                    return NotFound();
                }
                return Ok(eventTypes);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Unexpected error getting Event Types from MongoDb database. {ex}");
                return BadRequest("Unexpected error retrieving Events Typers");
            }
        }
    }
}
