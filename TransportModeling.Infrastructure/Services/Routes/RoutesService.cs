using Microsoft.EntityFrameworkCore;
using TransportModeling.Application.DTOs.Route;
using TransportModeling.Application.Interfaces;
using TransportModeling.Infrastructure.Data;

namespace TransportModeling.Infrastructure.Services.Routes;

public class RouteService: IRoutesService
{
    private readonly TransportDbContext _context;

    public RouteService(TransportDbContext context)
    {
        _context = context;
    }

    public async Task<List<RouteShortDto>> GetAllRoutesAsync()
    {
        var routes = await _context.Routes
            .OrderBy(r => r.Name)
            .Select(r => new RouteShortDto
            {
                RouteId = r.RouteId,
                Name = r.Name
            })
            .ToListAsync();
        
        if (routes == null) throw new Exception("В системі відсутні маршрути");

        return routes;
    }
}
