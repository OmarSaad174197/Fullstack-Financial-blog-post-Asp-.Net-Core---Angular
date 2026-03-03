namespace BlogPost.Helper;
// This class for filtering
public class QueryObject
{
    // properties to filter by
    public string? Symbol { get; set; } = null;
    public string? CompanyName { get; set; } = null;
    
    // Properties to sort (OrderBy)
    public string? SortBy { get; set; } = null;
    public bool IsDescinding { get; set; }
    
    // Properties for pagination
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}