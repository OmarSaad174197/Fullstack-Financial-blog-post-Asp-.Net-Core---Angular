using System.ComponentModel.DataAnnotations.Schema;

namespace BlogPost.Entities;
[Table("Portfolios")]
// this table is created from the relation N-N between User and Stock tables
public class Portfolio
{
    public string AppUserId { get; set; }
    public int StockId { get; set; }
    // Navigation properties
    public AppUser AppUser { get; set; }
    public Stock Stocks { get; set; }
}