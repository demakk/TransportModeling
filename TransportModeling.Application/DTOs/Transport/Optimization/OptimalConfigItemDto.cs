namespace TransportModeling.Application.DTOs.Transport.Optimization;

public class OptimalConfigItemDto
{
    public string TypeName { get; set; } = default!; // Наприклад: "Середній автобус"
    public int Count { get; set; }                   // Скільки таких автобусів
    public int Capacity { get; set; }  
}