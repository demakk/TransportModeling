namespace TransportModeling.Domain.Entities;

public class Route
{
    public int RouteId { get; set; }

    public string Name { get; set; } = null!;

    public double SocialImportanceIndex { get; set; }

    public int TripDurationMinutes { get; set; }

    public double RouteLengthKm { get; set; }
    

    public ICollection<RouteStop> RouteStops { get; set; } = new List<RouteStop>();

    public ICollection<LoadStatSet> StatSets { get; set; } = new List<LoadStatSet>();
}
