using System.Security.Claims;

namespace BlogPost.Extesions;

public static class ClaimsExtesions
{
    // This is for portfolio and things are related to it (user, appUser, etc..)
    public static string GetUSerName(this ClaimsPrincipal user)
    {
        return user.Claims
            .SingleOrDefault(x => x.Type.Equals("https://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"))
            .Value;
    }
}