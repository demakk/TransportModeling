using Microsoft.AspNetCore.Mvc;
using TransportModeling.Application.DTOs.Transport.GraphConstructor;
using TransportModeling.Application.Interfaces;

namespace TransportModeling.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GraphModelingController: ControllerBase
{
    private readonly IGraphModelingService _graphModelingService;
    
    public GraphModelingController(IGraphModelingService graphModelingService)
    {
        _graphModelingService = graphModelingService;
    }
    
    [HttpPost]
    public async Task<ActionResult<ModelingResultDto>> Calculate([FromBody] ModelingRequestDto request)
    {
            var result = await _graphModelingService.CalculateAsync(request);
            return Ok(result);

    }
}