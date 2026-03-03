using BlogPost.Entities;

namespace BlogPost.Services;

public interface ITokenService
{
    public string CreateToken(AppUser user);
}