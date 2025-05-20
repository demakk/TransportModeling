namespace TransportModeling.Application.DTOs.Transport.Optimization;

public class OptimizeFleetResultDto
{
    public string RouteName { get; set; } = default!;
    public string Period { get; set; } = default!;
    public List<OptimizeFleetOptionDto> Options { get; set; } = new();
}