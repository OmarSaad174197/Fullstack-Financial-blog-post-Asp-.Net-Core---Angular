using BlogPost.DTOs.Stock;
using BlogPost.Entities;

namespace BlogPost.Mappings;

public static class StockMapper
{
    // Extension method for mapping instead of AutoMapper
    public static StockDto ToStockDto(this Stock stockModel)
    {
        return new StockDto()
        {
            Id = stockModel.Id,
            Symbol = stockModel.Symbol,
            CompanyName = stockModel.CompanyName,
            Purchase = stockModel.Purchase,
            LastDiv = stockModel.LastDiv,
            Industry = stockModel.Industry,
            MarketCapacity = stockModel.MarketCapacity,
            // To shows the comments for each stock
            Comments = stockModel.Comments.Select(c => c.ToCommentDto()).ToList()
        };
    }

    public static Stock ToStockFromCreateDto(this AddStockDto stockModel)
    {
        return new Stock()
        {
            Symbol = stockModel.Symbol,
            CompanyName = stockModel.CompanyName,
            Purchase = stockModel.Purchase,
            LastDiv = stockModel.LastDiv,
            Industry = stockModel.Industry,
            MarketCapacity = stockModel.MarketCapacity
        };
    }
}