using Microsoft.EntityFrameworkCore;
using TransportModeling.Application.DTOs.Transport.GraphConstructor;
using TransportModeling.Application.DTOs.Transport.Optimization;
using TransportModeling.Application.Interfaces;
using TransportModeling.Domain.Entities;
using TransportModeling.Infrastructure.Data;

namespace TransportModeling.Infrastructure.Services.Optimization;

public class EconomicModelingService : IEconomicModelingService
{
    private readonly TransportDbContext _context;

    public EconomicModelingService(TransportDbContext context)
    {
        _context = context;
    }

 public async Task<OptimizeFleetResultDto> OptimizeAsync(OptimizeFleetRequestDto request)
    {
        var route = await _context.Routes
            .FirstOrDefaultAsync(r => r.Name == request.RouteName);

        if (route == null) throw new Exception("Маршрут не знайдено");

        var statSet = await _context.LoadStatSets
            .FirstOrDefaultAsync(s =>
                s.RouteId == route.RouteId &&
                s.PeriodCode == request.PeriodCode);

        if (statSet == null) throw new Exception("Немає даних для цього періоду");

        var loadStats = await _context.LoadStats
            .Where(ls => ls.StatSetId == statSet.StatSetId)
            .ToListAsync();

        var stops = await _context.Stops.ToListAsync();
        var routeStops = await _context.RouteStops
            .Where(rs => rs.RouteId == route.RouteId)
            .ToListAsync();

        var vehicleTypes = await _context.VehicleTypes
            .Where(v => request.BusTypes.Select(b => b.Capacity).Contains(v.Capacity))
            .ToListAsync();

        var capacityMap = request.BusTypes.ToDictionary(b => b.Capacity, b => b.MaxCount);

        var result = new OptimizeFleetResultDto
        {
            RouteName = route.Name,
            Period = statSet.PeriodCode,
            Options = new()
        };

        for (int a = 0; a <= (capacityMap.ContainsKey(30) ? capacityMap[30] : 0); a++)
        for (int b = 0; b <= (capacityMap.ContainsKey(50) ? capacityMap[50] : 0); b++)
        for (int c = 0; c <= (capacityMap.ContainsKey(80) ? capacityMap[80] : 0); c++)
        {
            var fleet = new List<(VehicleType type, int count)>
            {
                (vehicleTypes.FirstOrDefault(t => t.Capacity == 30)!, a),
                (vehicleTypes.FirstOrDefault(t => t.Capacity == 50)!, b),
                (vehicleTypes.FirstOrDefault(t => t.Capacity == 80)!, c)
            }.Where(x => x.type != null && x.count > 0).ToList();

            if (!fleet.Any()) continue;

            int T = statSet.DurationMinutes;
            double L = route.RouteLengthKm;
            int tripDuration = route.TripDurationMinutes;
            int totalBoardings = loadStats.Sum(l => l.Boardings);

            int totalTrips = 0;
            double totalCapacity = 0;
            double totalCost = 0;

            foreach (var (type, count) in fleet)
            {
                var tripsPerVehicle = (int)Math.Floor((double)T / tripDuration);
                var totalTripsForType = count * tripsPerVehicle;
                totalTrips += totalTripsForType;
                totalCapacity += totalTripsForType * type.Capacity;
                totalCost += totalTripsForType * L * type.CostPerKm;
            }

            if (totalCapacity == 0 || totalTrips == 0) continue;

            var ticketPrice = totalCost / totalBoardings;

            var stopsLoad = loadStats.Select(ls =>
            {
                var stop = stops.First(s => s.StopId == ls.StopId);
                var order = routeStops.First(rs => rs.StopId == stop.StopId).OrderInRoute;
                return new StopLoadDto
                {
                    OrderInRoute = order,
                    StopName = stop.Name,   
                    TotalPassengers = ls.TotalPassengers,
                    AvailableCapacity = (int)(totalCapacity)
                };
            }).ToList();

            var avgLoad = stopsLoad.Average(sl => sl.LoadPercentage);
            var maxLoad = stopsLoad.Max(sl => sl.LoadPercentage);
            var interval = (double)T / totalTrips;
            
            
            if (avgLoad  > statSet.AvgLoad * 100 ||
                maxLoad  > statSet.MaxPeakLoad * 100 ||
                interval > statSet.MaxIntervalMinutes)
            {
                continue; // Пропускаємо цю конфігурацію
            }

            result.Options.Add(new OptimizeFleetOptionDto
            {
                OptimalConfig = fleet.Select(f => new OptimalConfigItemDto
                {
                    TypeName = f.type.Name,
                    Capacity = f.type.Capacity,
                    Count = f.count
                }).ToList(),
                AvgLoad = Math.Round(avgLoad, 2),
                MaxLoad = Math.Round(maxLoad, 2),
                Interval = Math.Round(interval, 2),
                TicketPrice = Math.Round(ticketPrice, 2),
                StopsLoad = stopsLoad
            });
        }

        result.Options = result.Options
            .OrderBy(o => o.TicketPrice)
            .Take(3)
            .ToList();

        return result;
    }

}