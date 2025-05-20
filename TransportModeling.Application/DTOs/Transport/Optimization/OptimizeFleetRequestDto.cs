namespace TransportModeling.Application.DTOs.Transport.Optimization;

public class OptimizeFleetRequestDto
{
    public string RouteName { get; set; } = null!;
    public string PeriodCode { get; set; } = null!;
    public List<BusTypeLimitDto> BusTypes { get; set; } = new();
}