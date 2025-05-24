using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TransportModeling.Application.Interfaces;
using TransportModeling.Domain.Entities;
using TransportModeling.Infrastructure.Data;
using TransportModeling.Infrastructure.Services.Auth;
using TransportModeling.Infrastructure.Services.Optimization;
using TransportModeling.Infrastructure.Services.Routes;
using TransportModeling.Infrastructure.Services.TransportGraph;

namespace TransportModeling.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
    {
        services.AddDbContext<AuthDbContext>(options =>
            options.UseSqlServer(config.GetConnectionString("DefaultConnection")));

        services.AddDbContext<TransportDbContext>(options =>
            options.UseSqlServer(config.GetConnectionString("DefaultConnection")));

        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
        services.AddScoped<IGraphModelingService, GraphModelingService>();
        services.AddScoped<IEconomicModelingService, EconomicModelingService>();
        services.AddScoped<IRoutesService, RouteService>();

        return services;
    }
}