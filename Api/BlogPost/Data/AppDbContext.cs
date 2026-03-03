using System.Reflection.Metadata.Ecma335;
using BlogPost.DTOs.Account;
using BlogPost.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
namespace BlogPost.Data;
public class AppDbContext : IdentityDbContext<AppUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> dbContextOptions) : base(dbContextOptions)
    {
    }
    public DbSet<Stock> Stocks { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<Portfolio> Portfolios { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        // To create models before anything
        base.OnModelCreating(builder);
        
        // Configure portfolio
        // Determine F.K
        builder.Entity<Portfolio>
            (x => x.HasKey
                (p => new { p.AppUserId, p.StockId }));
        // Configure relations for portfolio
        builder.Entity<Portfolio>()
            .HasOne(p => p.AppUser)
            .WithMany(p => p.Portfolios)
            .HasForeignKey(p => p.AppUserId);
        
        builder.Entity<Portfolio>()
            .HasOne(p => p.Stocks)
            .WithMany(p => p.Portfolios)
            .HasForeignKey(p => p.StockId);
        
        // Seeding roles
        List<IdentityRole> Roles = new List<IdentityRole>
        {
            new IdentityRole
            {
                // When I tried to update db, there was a problem that some dynamic values such as GUID was generated,
                // So I put this 'ID' to make it static value
                Id = "admin-role-id",
                Name = "Admin",
                NormalizedName = "ADMIN"
            },
            new IdentityRole
            {
                Id = "user-role-id",
                Name = "User",
                NormalizedName = "USER"
            }
        };
        builder.Entity<IdentityRole>().HasData(Roles);
    }
}