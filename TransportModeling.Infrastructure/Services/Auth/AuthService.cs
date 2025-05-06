using System.Collections.Concurrent;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using TransportModeling.Application.DTOs.Auth;
using TransportModeling.Application.Interfaces;
using TransportModeling.Domain.Entities;
using TransportModeling.Infrastructure.Data;

namespace TransportModeling.Infrastructure.Services.Auth;

public class AuthService : IAuthService
{
    private readonly AuthDbContext _db;
    private readonly IPasswordHasher<User> _hasher;
    private readonly TokenService _tokenService;
    private readonly IConfiguration _configuration;

    public AuthService(AuthDbContext db, IPasswordHasher<User> hasher, TokenService tokenService, IConfiguration configuration)
    {
        _db = db;
        _hasher = hasher;
        _tokenService = tokenService;
        _configuration = configuration;
    }

    public async Task<string?> RegisterAsync(RegisterRequest request)
    {
        
        if (await _db.Users.AnyAsync(u => u.Username == request.Username))
            return null;

        var user = new User
        {
            Username = request.Username,
            Role = request.Role ?? "user",
            PasswordHash = _hasher.HashPassword(null!, request.Password)
        };
        
        
        

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return _tokenService.CreateToken(user.Id.ToString(), user.Username, user.Role);
        
    }

    
    
    public async Task<string?> LoginAsync(LoginRequest request)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
        if (user == null)
            return null;

        var result = _hasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (result != PasswordVerificationResult.Success)
            return null;

        return _tokenService.CreateToken(user.Id.ToString(), user.Username, user.Role);
    }
}