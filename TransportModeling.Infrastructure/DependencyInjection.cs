using Microsoft.Extensions.DependencyInjection;
using TransportModeling.Infrastructure.Services.Auth;

namespace TransportModeling.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<TokenService>();
        services.AddScoped<AuthService>();

        // Тут також будеш підключати базу даних, інші сервіси потім
        return services;
    }
}