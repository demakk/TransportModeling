using TransportModeling.Application.DTOs.Transport.GraphConstructor;
using TransportModeling.Application.DTOs.Transport.Optimization;

namespace TransportModeling.Application.Interfaces;

public interface IEconomicModelingService
{
    Task<OptimizeFleetResultDto> OptimizeAsync(OptimizeFleetRequestDto request);
    Task<RouteNormsDto?> GetRouteNormsAsync(string routeName, string periodCode);
}