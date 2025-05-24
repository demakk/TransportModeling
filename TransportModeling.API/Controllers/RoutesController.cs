using Microsoft.AspNetCore.Mvc;
using TransportModeling.Application.DTOs.Route;
using TransportModeling.Application.Interfaces;

namespace TransportModeling.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RouteController : ControllerBase
{
    private readonly IRoutesService _routeService;

    public RouteController(IRoutesService routeService)
    {
        _routeService = routeService;
    }

    [HttpGet("list")]
    public async Task<ActionResult<List<RouteShortDto>>> GetRoutes()
    {
        var routes = await _routeService.GetAllRoutesAsync();
        return Ok(routes);
    }
}