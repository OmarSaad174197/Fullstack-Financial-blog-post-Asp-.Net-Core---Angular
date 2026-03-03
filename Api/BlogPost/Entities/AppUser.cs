using Microsoft.AspNetCore.Identity;

namespace BlogPost.Entities;

public class AppUser: IdentityUser
{
    public List<Portfolio> Portfolios { get; set; } = new List<Portfolio>();
}