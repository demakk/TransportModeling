using TransportModeling.Application.DTOs.Transport.GraphConstructor;

namespace TransportModeling.Application.Interfaces;

public interface IGraphModelingService
{
    Task<ModelingResultDto> CalculateAsync(ModelingRequestDto request);
}