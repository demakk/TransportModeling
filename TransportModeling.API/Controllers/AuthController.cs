using Microsoft.AspNetCore.Mvc;
using TransportModeling.Application.DTOs.Auth;
using TransportModeling.Infrastructure.Services.Auth;

namespace TransportModeling.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task <IActionResult> Register([FromBody] RegisterRequest request)
    {
        var token = await _authService.RegisterAsync(request);
        if (token is null)
            return Conflict("Користувач з таким ім'ям вже існує.");

        return Ok(new RegisterResponse { Token = token });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var token = await _authService.LoginAsync(request);
        if (token == null)
            return Unauthorized("Невірний логін або пароль.");

        return Ok(new LoginResponse { Token = token });
    }
}