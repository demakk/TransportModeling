namespace TransportModeling.Domain.Entities;

public class RouteStop
{
    public int Id { get; set; }

    public int RouteId { get; set; }
    public Route Route { get; set; } = null!;

    public int StopId { get; set; }
    public Stop Stop { get; set; } = null!;

    public int OrderInRoute { get; set; }
    public bool IsTerminal { get; set; }
}
