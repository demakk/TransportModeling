using TransportModeling.Domain.Enums;

namespace TransportModeling.Domain.Entities;

public class LoadStatSet
{
    public int StatSetId { get; set; }

    public int RouteId { get; set; }
    public Route Route { get; set; } = null!;

    public string PeriodCode { get; set; } = null!;
    public string? PeriodLabel { get; set; }

    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }

    public int DurationMinutes { get; set; }

    public string DayType { get; set; } = null!;

    public ICollection<LoadStat> Stats { get; set; } = new List<LoadStat>();
}
