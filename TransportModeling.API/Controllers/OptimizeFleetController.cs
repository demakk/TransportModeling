using Microsoft.AspNetCore.Mvc;
using TransportModeling.Application.DTOs.Transport.GraphConstructor;
using TransportModeling.Application.DTOs.Transport.Optimization;
using TransportModeling.Application.Interfaces;

namespace TransportModeling.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OptimizeFleetController : ControllerBase
{
    private readonly IEconomicModelingService _modelingService;

    public OptimizeFleetController(IEconomicModelingService modelingService)
    {
        _modelingService = modelingService;
    }

    [HttpPost]
    public async Task<ActionResult<OptimizeFleetResultDto>> OptimizeFleet([FromBody] OptimizeFleetRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.RouteName) || string.IsNullOrWhiteSpace(request.PeriodCode))
            return BadRequest("Потрібно вказати маршрут і період");

        if (request.BusTypes == null || request.BusTypes.Count == 0)
            return BadRequest("Не вказано жодного типу ТЗ");

        try
        {
            var result = await _modelingService.OptimizeAsync(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
    
    
    [HttpGet("norms")]
    public async Task<ActionResult<RouteNormsDto>> GetNorms(
        [FromQuery] string routeName,
        [FromQuery] string periodCode)
    {
        RouteNormsDto? norms = await _modelingService.GetRouteNormsAsync(routeName, periodCode);
        if (norms == null) return NotFound("Норми не знайдено");
        return Ok(norms);
    }

}