using System.ComponentModel.DataAnnotations;

namespace BlogPost.DTOs.Account;

public class LoginDto
{
    [Required]
    public string UserName { get; set; }
    [Required]
    public string Email { get; set; }
    [Required]
    public string Password { get; set; }
}