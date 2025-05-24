namespace TransportModeling.Application.DTOs.Transport.GraphConstructor;

public class RouteNormsDto
{
    public string RouteName { get; set; } = null!;
    public string PeriodCode { get; set; } = null!;

    public double MaxAvgLoad { get; set; }
    public double MaxPeakLoad { get; set; }
    public int MaxIntervalMinutes { get; set; }
}