using System.Collections.Concurrent;
using TransportModeling.Application.DTOs.Auth;

namespace TransportModeling.Infrastructure.Services.Auth;

public class AuthService
{
    private readonly TokenService _tokenService;

    // Для простоти: тимчасове сховище користувачів (потім замінимо на БД)
    private static ConcurrentDictionary<string, (string Password, string Role)> _users = new();

    public AuthService(TokenService tokenService)
    {
        _tokenService = tokenService;
    }

    public bool Register(RegisterRequest request)
    {
        if (_users.ContainsKey(request.Username))
            return false; // Користувач вже існує

        _users.TryAdd(request.Username, (request.Password, request.Role));
        return true;
    }

    public string Login(LoginRequest request)
    {
        if (_users.TryGetValue(request.Username, out var userData))
        {
            if (userData.Password == request.Password)
            {
                // Логін успішний
                return _tokenService.CreateToken(Guid.NewGuid().ToString(), request.Username, userData.Role);
            }
        }

        return null;
    }
}