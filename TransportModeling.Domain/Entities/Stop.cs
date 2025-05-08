namespace TransportModeling.Domain.Entities;

public class Stop
{
    public int StopId { get; set; }
    public string Name { get; set; } = null!;
    public double Lat { get; set; }
    public double Lon { get; set; }
}
