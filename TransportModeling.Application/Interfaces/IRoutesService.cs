using TransportModeling.Application.DTOs.Route;

namespace TransportModeling.Application.Interfaces;

public interface IRoutesService
{
    Task<List<RouteShortDto>> GetAllRoutesAsync();
}