using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TransportModeling.Application.Interfaces;
using TransportModeling.Domain.Entities;
using TransportModeling.Infrastructure.Data;
using TransportModeling.Infrastructure.Services.Auth;

namespace TransportModeling.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
    {
        services.AddDbContext<AuthDbContext>(options =>
            options.UseSqlServer(config.GetConnectionString("DefaultConnection")));


        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();

        return services;
    }
}