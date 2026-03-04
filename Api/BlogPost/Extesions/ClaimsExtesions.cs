using System.Security.Claims;

namespace BlogPost.Extesions;

public static class ClaimsExtesions
{
    // This is for portfolio and things are related to it (user, appUser, etc..)
    public static string? GetUSerName(this ClaimsPrincipal user)
    {
        return user.FindFirstValue(ClaimTypes.GivenName)
               ?? user.FindFirstValue("given_name")
               ?? user.FindFirstValue(ClaimTypes.Name)
               ?? user.Identity?.Name;
    }
}
