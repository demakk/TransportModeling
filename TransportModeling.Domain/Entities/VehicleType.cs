namespace TransportModeling.Domain.Entities;

public class VehicleType
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public int Capacity { get; set; }
    public double CostPerKm { get; set; }
    public string? Notes { get; set; }
}