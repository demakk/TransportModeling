namespace TransportModeling.Domain.Entities;

public class LoadStat
{
    public int Id { get; set; }

    public int StatSetId { get; set; }
    public LoadStatSet StatSet { get; set; } = null!;

    public int StopId { get; set; }
    public Stop Stop { get; set; } = null!;

    public int TotalPassengers { get; set; }
}
