using System.ComponentModel.DataAnnotations;

namespace BlogPost.DTOs.Stock;

public class AddStockDto
{
    [Required]
    [MaxLength(10, ErrorMessage = "Symbol can not exceed 10 characters")]
    public string Symbol { get; set; } = string.Empty;
    [Required]
    [MaxLength(10, ErrorMessage = "Company name can not exceed 10 characters")]
    public string CompanyName { get; set; } = string.Empty;
    [Required]
    [Range(1,1000000000)]
    public decimal Purchase { get; set; }
    [Required]
    [Range(0.001,100)]
    public decimal LastDiv { get; set; }
    [Required]
    [MaxLength(10, ErrorMessage = "Industry can not exceed 10 characters")]
    public string Industry { get; set; } = string.Empty;
    [Required]
    [Range(1,5000000000)]
    public  long MarketCapacity { get; set; }
}