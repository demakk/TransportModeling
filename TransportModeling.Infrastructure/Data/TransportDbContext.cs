using Microsoft.EntityFrameworkCore;
using TransportModeling.Domain.Entities;

namespace TransportModeling.Infrastructure.Data;

public class TransportDbContext : DbContext
{
    public DbSet<Stop> Stops => Set<Stop>();
    public DbSet<Route> Routes => Set<Route>();
    public DbSet<RouteStop> RouteStops => Set<RouteStop>();
    public DbSet<LoadStatSet> LoadStatSets => Set<LoadStatSet>();
    public DbSet<LoadStat> LoadStats => Set<LoadStat>();

    public TransportDbContext(DbContextOptions<TransportDbContext> options) : base(options) {}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    // stops
    modelBuilder.Entity<Stop>(e =>
    {
        e.ToTable("stops");

        e.HasKey(x => x.StopId);
        e.Property(x => x.StopId).HasColumnName("stop_id");
        e.Property(x => x.Name).HasColumnName("name");
        e.Property(x => x.Lat).HasColumnName("lat");
        e.Property(x => x.Lon).HasColumnName("lon");
    });

    // routes
    modelBuilder.Entity<Route>(e =>
    {
        e.ToTable("routes");

        e.HasKey(x => x.RouteId);
        e.Property(x => x.RouteId).HasColumnName("route_id");
        e.Property(x => x.Name).HasColumnName("name");
        e.Property(x => x.SocialImportanceIndex).HasColumnName("social_importance_index");
        e.Property(x => x.TripDurationMinutes).HasColumnName("trip_duration_minutes");
    });

    // route_stops
    modelBuilder.Entity<RouteStop>(e =>
    {
        e.ToTable("route_stops");

        e.HasKey(x => x.Id);
        e.Property(x => x.Id).HasColumnName("id");
        e.Property(x => x.RouteId).HasColumnName("route_id");
        e.Property(x => x.StopId).HasColumnName("stop_id");
        e.Property(x => x.OrderInRoute).HasColumnName("order_in_route");
        e.Property(x => x.IsTerminal).HasColumnName("is_terminal");

        e.HasOne(x => x.Route)
         .WithMany(r => r.RouteStops)
         .HasForeignKey(x => x.RouteId);

        e.HasOne(x => x.Stop)
         .WithMany()
         .HasForeignKey(x => x.StopId);
    });

    // load_stat_sets
    modelBuilder.Entity<LoadStatSet>(e =>
    {
        e.ToTable("load_stat_sets");

        e.HasKey(x => x.StatSetId);
        e.Property(x => x.StatSetId).HasColumnName("stat_set_id");
        e.Property(x => x.RouteId).HasColumnName("route_id");
        e.Property(x => x.PeriodCode).HasColumnName("period_code");
        e.Property(x => x.PeriodLabel).HasColumnName("period_label");
        e.Property(x => x.StartDate).HasColumnName("start_date");
        e.Property(x => x.EndDate).HasColumnName("end_date");
        e.Property(x => x.DurationMinutes).HasColumnName("duration_minutes");
        e.Property(x => x.DayType).HasColumnName("day_type");

        e.HasOne(x => x.Route)
         .WithMany(r => r.StatSets)
         .HasForeignKey(x => x.RouteId);
    });

    // load_stats
    modelBuilder.Entity<LoadStat>(e =>
    {
        e.ToTable("load_stats");

        e.HasKey(x => x.Id);
        e.Property(x => x.Id).HasColumnName("id");
        e.Property(x => x.StatSetId).HasColumnName("stat_set_id");
        e.Property(x => x.StopId).HasColumnName("stop_id");
        e.Property(x => x.TotalPassengers).HasColumnName("total_passengers");

        e.HasOne(x => x.StatSet)
         .WithMany(s => s.Stats)
         .HasForeignKey(x => x.StatSetId);

        e.HasOne(x => x.Stop)
         .WithMany()
         .HasForeignKey(x => x.StopId);
    });
}

}