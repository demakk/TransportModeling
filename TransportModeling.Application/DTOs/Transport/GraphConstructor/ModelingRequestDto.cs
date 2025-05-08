using TransportModeling.Domain.Enums;

namespace TransportModeling.Application.DTOs.Transport.GraphConstructor;

public class ModelingRequestDto
{
    public string RouteName { get; set; } = null!;
    public string PeriodCode { get; set; }
    public List<BusInQueueDto> BusQueue { get; set; } = new();
}