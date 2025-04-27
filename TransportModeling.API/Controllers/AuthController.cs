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
    public IActionResult Register([FromBody] RegisterRequest request)
    {
        var success = _authService.Register(request);
        if (!success)
            return Conflict("Користувач з таким ім'ям вже існує.");

        return Ok("Реєстрація успішна.");
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        var token = _authService.Login(request);
        if (token == null)
            return Unauthorized("Невірний логін або пароль.");

        return Ok(new LoginResponse { Token = token });
    }
}