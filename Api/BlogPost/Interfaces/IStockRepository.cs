using BlogPost.DTOs.Stock;
using BlogPost.Entities;
using BlogPost.Helper;

namespace BlogPost.Interfaces;

public interface IStockRepository
{
    Task<List<Stock>> GetAllAsync(QueryObject query);
    Task<Stock?> GetByIdAsync(int id);
    // For getting portfolio by symbol
    Task<Stock?> GetBySymbolAsync(string symbol);
    Task<Stock> CreateAsync(Stock stockModel);
    Task<Stock?> UpdateAsync(int id, UpdateStockDto stockDto);
    Task<Stock?> DeleteAsync(int id);
    // For checking stock existence for adding comment
    Task<bool> StockExists(int id);
}