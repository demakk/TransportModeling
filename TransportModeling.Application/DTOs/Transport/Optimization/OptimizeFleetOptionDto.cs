using TransportModeling.Application.DTOs.Transport.GraphConstructor;

namespace TransportModeling.Application.DTOs.Transport.Optimization;
    
public class OptimizeFleetOptionDto
{
    public List<OptimalConfigItemDto> OptimalConfig { get; set; } = new();
    public double AvgLoad { get; set; }
    public double MaxLoad { get; set; }
    public double Interval { get; set; }
    public double TicketPrice { get; set; }
    public List<StopLoadDto> StopsLoad { get; set; } = new();
}