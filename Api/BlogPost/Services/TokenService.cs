using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BlogPost.Entities;
using Microsoft.IdentityModel.Tokens;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;

namespace BlogPost.Services;

public class TokenService : ITokenService
{
    private readonly IConfiguration _configuration; // for access jwt in appsettings.json
    #region  Notes for Key
    // note that the SymmetricSecurityKey not from best practice to inject in constructor..
    // as it is an object and has a value not a full service.
    // So i will create a variable that takes that key.
    #endregion
    public TokenService (IConfiguration configuration)
    {
        _configuration = configuration;
    }
    public string CreateToken(AppUser user)
    {
        // create claims similar to roles, but more flexible
        var claims = new List<Claim>()
        {
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.GivenName, user.UserName)
        };
        // Create the  secret key
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:SignInKey"]));
        
        // Create sign in credential: for what type of encryption do you want
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        // Create the token
        var tokenDescriptor = new SecurityTokenDescriptor()
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = credentials,
            Issuer = _configuration["JWT:Issuer"],
            Audience = _configuration["JWT:Audience"]
        };
        // Create the token handler that actual creates the token 
        var tokenHandler = new JwtSecurityTokenHandler();
        
        // Creates the token as an object
        var token = tokenHandler.CreateToken(tokenDescriptor);
        
        // return the token in form of string
        return tokenHandler.WriteToken(token);
    }
}