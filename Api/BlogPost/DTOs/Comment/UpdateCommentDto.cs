using System.ComponentModel.DataAnnotations;

namespace BlogPost.DTOs.Comment;

public class UpdateCommentDto
{
    [Required]
    [MinLength(5,ErrorMessage = "Title must be at least 5 characters long")]
    [MaxLength(20,ErrorMessage = "Title cannot exceed 20 characters")]
    public string Title { get; set; } =string.Empty;
    [Required]
    [MinLength(5,ErrorMessage = "Title must be at least 5 characters long")]
    [MaxLength(20,ErrorMessage = "Title cannot exceed 20 characters")]
    public string Content { get; set; } = string.Empty;
}