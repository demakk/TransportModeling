using TransportModeling.Application.DTOs.Auth;
using TransportModeling.Domain.Entities;

namespace TransportModeling.Application.Interfaces;

public interface IAuthService
{
    Task<string?> RegisterAsync(RegisterRequest request);
    Task<string?> LoginAsync(LoginRequest request);
}