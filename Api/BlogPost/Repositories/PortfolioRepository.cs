using BlogPost.Data;
using BlogPost.Entities;
using BlogPost.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BlogPost.Repositories;

public class PortfolioRepository : IPortfolioRepository
{
    private readonly AppDbContext _context;

    public PortfolioRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Stock>> GetUSerPortfolio(AppUser user)
    {
        return await _context.Portfolios.Where(u => u.AppUserId == user.Id)
            .Select(Stock => new Stock
            {
                // Mapping
                Id = Stock.StockId,
                Symbol = Stock.Stocks.Symbol,
                Purchase = Stock.Stocks.Purchase,
                CompanyName = Stock.Stocks.CompanyName,
                LastDiv = Stock.Stocks.LastDiv,
                MarketCapacity = Stock.Stocks.MarketCapacity,
                Industry = Stock.Stocks.Industry
            }).ToListAsync();
    }

    public async Task<Portfolio> CreatePortfolioAsync(Portfolio portfolio)
    {
        await _context.Portfolios.AddAsync(portfolio);
        await _context.SaveChangesAsync();
        return portfolio;
    }

    public async Task<Portfolio> DeletePortfolioAsync(AppUser appUser, string symbol)
    {
        var portfolioModel = await _context.Portfolios
            .FirstOrDefaultAsync(x => x.AppUserId == appUser.Id
            && x.Stocks.Symbol.ToLower()==symbol.ToLower());
        
        if(portfolioModel == null) return null;
        
        _context.Remove(portfolioModel);
        await _context.SaveChangesAsync();
        return portfolioModel;
        
    }
}