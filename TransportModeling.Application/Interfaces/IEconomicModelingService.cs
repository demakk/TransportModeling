using TransportModeling.Application.DTOs.Transport.GraphConstructor;
using TransportModeling.Application.DTOs.Transport.Optimization;

namespace TransportModeling.Application.Interfaces;

public interface IEconomicModelingService
{
    Task<OptimizeFleetResultDto> OptimizeAsync(OptimizeFleetRequestDto request);
}