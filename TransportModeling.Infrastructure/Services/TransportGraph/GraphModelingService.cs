using Microsoft.EntityFrameworkCore;
using TransportModeling.Application.DTOs.Transport.GraphConstructor;
using TransportModeling.Application.Interfaces;
using TransportModeling.Domain.Enums;
using TransportModeling.Infrastructure.Data;

namespace TransportModeling.Infrastructure.Services.TransportGraph;

public class GraphModelingService : IGraphModelingService
{
    private readonly TransportDbContext _db;

    public GraphModelingService(TransportDbContext db)
    {
        _db = db;
    }
    
public async Task<ModelingResultDto> CalculateAsync(ModelingRequestDto request)
{
    // 1. Знаходимо маршрут
    var route = await _db.Routes
        .FirstOrDefaultAsync(r => r.Name == request.RouteName)
        ?? throw new InvalidOperationException("Маршрут не знайдено");

    // 2. Знаходимо набір статистики по періоду
    var statSet = await _db.LoadStatSets
        .Include(s => s.Stats)
        .FirstOrDefaultAsync(s =>
            s.RouteId == route.RouteId &&
            s.PeriodCode == request.PeriodCode)
        ?? throw new InvalidOperationException("Статистика не знайдена для заданого періоду");

    // 3. Витягуємо зупинки маршруту в порядку
    var routeStops = await _db.RouteStops
        .Where(rs => rs.RouteId == route.RouteId)
        .OrderBy(rs => rs.OrderInRoute)
        .Include(rs => rs.Stop)
        .ToListAsync();

    var statByStopId = statSet.Stats.ToDictionary(s => s.StopId, s => s.TotalPassengers);

    // 4. Вхідна черга автобусів
    var baseQueue = request.BusQueue.Select(b => b.Capacity).ToList();
    if (!baseQueue.Any())
        throw new InvalidOperationException("Черга автобусів порожня");

    // 5. Повна кількість повторень
    var tripDuration = route.TripDurationMinutes;
    var periodMinutes = statSet.DurationMinutes;
    var repeats = periodMinutes / tripDuration;

    // 6. Загальна доступна місткість за період
    var totalCapacity = baseQueue.Sum(cap => cap * repeats);

    // 7. Інтервал між відправленнями
    var interval = (double)tripDuration / baseQueue.Count;

    // 8. Формування DTO
    var result = new ModelingResultDto
    {
        RouteName = route.Name,
        IntervalMinutes = interval,
        StopsLoad = new List<StopLoadDto>()
    };

    foreach (var rs in routeStops)
    {
        var passengers = statByStopId.TryGetValue(rs.StopId, out var val) ? val : 0;

        result.StopsLoad.Add(new StopLoadDto
        {
            OrderInRoute = rs.OrderInRoute,
            StopName = rs.Stop.Name,
            TotalPassengers = passengers,
            AvailableCapacity = totalCapacity // однакове значення для всіх
        });
    }

    return result;
}

}