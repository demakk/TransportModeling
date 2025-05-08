using TransportModeling.Domain.Enums;

namespace TransportModeling.Application.DTOs.Transport.GraphConstructor;

public class ModelingResultDto
{
    public string RouteName { get; set; } = null!;
    public string Period { get; set; } = null!;
    public double IntervalMinutes { get; set; }
    public List<StopLoadDto> StopsLoad { get; set; } = new();
}
