namespace TransportModeling.Application.DTOs.Transport.GraphConstructor;

public class StopLoadDto
{
    public int OrderInRoute { get; set; }
    public string StopName { get; set; } = null!;
    
    public int TotalPassengers { get; set; }
    public int AvailableCapacity { get; set; }
    
    public double LoadPercentage =>
        AvailableCapacity == 0 ? 0 : Math.Round((double)TotalPassengers / AvailableCapacity * 100, 2);
}
