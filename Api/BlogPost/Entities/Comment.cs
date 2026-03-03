using System.ComponentModel.DataAnnotations.Schema;

namespace BlogPost.Entities;
[Table("Comments")]
public class Comment
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;
    
    public string Content { get; set; } = string.Empty;

    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    
    public int? StockId { get; set; }
    // Navigation Property to allow access the entity with dot notation,(LazyLoading)
    public Stock? Stock { get; set; }
    
    // Represents the relation 1-1 between comment and user
    public string UserId { get; set; }
    public AppUser AppUser { get; set; }
        
}