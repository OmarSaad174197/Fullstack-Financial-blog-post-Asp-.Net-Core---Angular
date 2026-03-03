using BlogPost.Data;
using BlogPost.DTOs.Stock;
using BlogPost.Entities;
using BlogPost.Helper;
using BlogPost.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BlogPost.Repositories;
public class StockRepository : IStockRepository
{
    private readonly AppDbContext _context;

    public StockRepository(AppDbContext context)
    {
        _context = context;
    }
    public async Task<List<Stock>> GetAllAsync(QueryObject query)
    {
        #region UserExpalnation
        // I used include to include the comments entity as the relation between stock and comment is 1-M
        // I used AsQueryable to filter by (Where) 
        #endregion
        
        var stocks = _context.Stocks
            .Include(c => c.Comments)
            .ThenInclude(a => a.AppUser) // to include user also to stock and comment
            .AsQueryable();
        
        // Check and filter by specific columns.
        if (!string.IsNullOrWhiteSpace(query.CompanyName))
        {
            stocks = stocks.Where(s => s.CompanyName.Contains(query.CompanyName));
        }

        if (!string.IsNullOrWhiteSpace(query.Symbol))
        {
            stocks = stocks.Where(s => s.Symbol.Contains(query.Symbol));
        }
        
        // Check and sorting by a specific column
        if (!string.IsNullOrWhiteSpace(query.SortBy))
        {
            #region Userexpalnations
            // This is the specific column I want to sort by.
            // I used 'Equals' to compare the entered string to the right string and also for validation purpose.
            // 'StringComparison.OrdinalIgnoreCase': to ignore the  entered wrong characters using (UTF-8)
            #endregion
            if (query.SortBy.Equals("Symbol", StringComparison.OrdinalIgnoreCase))
            // if (query.SortBy.Contains("Symb"))
            {
                stocks = query.IsDescinding ? stocks.OrderByDescending(S => S.Symbol)
                    : stocks.OrderBy(s => s.Symbol);
            }
        }
        // Pagination calculation 
        var skipNumber = (query.PageNumber - 1) * query.PageSize;
        // return all the stocks after filtering and sorting with pagination
        return await stocks.Skip(skipNumber).Take(query.PageSize).ToListAsync();
        
        // return all the stocks after filtering and sorting without pagination
        // return await stocks.ToListAsync();
    }
    public async Task<Stock?> GetByIdAsync(int id)
    {
        // I used include to include the comments entity as the relation between stock and comment is 1-M
        return await _context.Stocks.Include(c => c.Comments).FirstOrDefaultAsync(x=>x.Id == id);
    }
    public async Task<Stock> CreateAsync(Stock stockModel)
    {
         await _context.Stocks.AddAsync(stockModel);
         await _context.SaveChangesAsync();
         return stockModel;
    }
    public async Task<Stock?> UpdateAsync(int id, UpdateStockDto stockDto)
    {
        var existingStock = await _context.Stocks.FindAsync(id);
        if (existingStock == null)
        {
            return null;
        }
        existingStock.Industry = stockDto.Industry;
        existingStock.LastDiv = stockDto.LastDiv;
        existingStock.MarketCapacity = stockDto.MarketCapacity;
        existingStock.Purchase = stockDto.Purchase;
        existingStock.Symbol = stockDto.Symbol;
        
        await _context.SaveChangesAsync();
        return existingStock;
    }

    public async Task<Stock?> DeleteAsync(int id)
    {
        var stockModel = _context.Stocks.FirstOrDefault(x => x.Id == id);
        if (stockModel == null)
        {
            return null;
        }
        _context.Stocks.Remove(stockModel);
        await _context.SaveChangesAsync();
        return stockModel;
    }
    // For checking stock existence for adding comment
    public async Task<bool> StockExists(int id)
    {
        return await _context.Stocks.AnyAsync(s => s.Id == id);
    }
    // For Getting the user portfolio by symbol
    public async Task<Stock?> GetBySymbolAsync(string symbol)
    {
        return await _context.Stocks.FirstOrDefaultAsync(s => s.Symbol == symbol);
    }
}