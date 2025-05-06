namespace TransportModeling.Domain.Entities;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Username { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public string Role { get; set; } = "user";
}