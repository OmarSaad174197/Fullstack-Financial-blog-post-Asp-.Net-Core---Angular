using BlogPost.DTOs.Account;
using BlogPost.Entities;
using BlogPost.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BlogPost.Controllers;
[Route("api/[controller]")]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    private readonly ITokenService _tokenService;
    private readonly SignInManager<AppUser> _signInManager;

    public AccountController(UserManager<AppUser> userManager, ITokenService tokenService, SignInManager<AppUser> signInManager)
    {
        _userManager = userManager;
        _tokenService = tokenService;
        _signInManager = signInManager;
    }
    [HttpPost("Register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        try
        {
            // Check the format og the email and password
            if (!ModelState.IsValid) return BadRequest(ModelState);
            
            // User creation
            var User = new AppUser
            {
                UserName = registerDto.UserName,
                Email = registerDto.Email
            };
            var createdUser = await _userManager.CreateAsync(User, registerDto.Password);
            // Check if the user created correctly and saved in the db:
            if (createdUser.Succeeded)
            {
                // assign role to the user
                var roleResult = await _userManager.AddToRoleAsync(User, "User");
                if (roleResult.Succeeded) 
                    // Create the token with the specified dto for it
                {
                    return Ok(new 
                        NewUserDto
                        {
                            UserName = User.UserName,
                            Email = User.Email,
                            Token = _tokenService.CreateToken(User)
                        }
                    );
                }
                else
                {
                    return StatusCode(500, roleResult.Errors);
                }
            }
            // if the user in not created
            else
            {
                return StatusCode(500, createdUser.Errors);
            }
        }
        // if the registration failed لا قدر الله يعني
        catch (Exception ex)
        {
            return StatusCode(500, ex);
        }
    }

    [HttpPost("Login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        // Check the format of login process
        if (!ModelState.IsValid) return BadRequest(ModelState);
        
        // Check if the user exist or not
        // var existingUser = await _userManager.FindByEmailAsync(loginDto.Email.ToLower());
        var user = await _userManager.Users
            .FirstOrDefaultAsync(e => e.UserName == loginDto.UserName.ToLower());
        if (user == null) return Unauthorized("Invalid username, Enter a valid username");
        
        // Check the password
        var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
        if (!result.Succeeded) 
            return Unauthorized("Invalid username or password, login again with right username and password");
        
        // Otherwise, Login and create the token
        return Ok(
            new NewUserDto()
            {
                UserName = loginDto.UserName,
                Email = loginDto.Email,
                Token = _tokenService.CreateToken(user)
            }
        );
    }
}