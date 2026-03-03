using BlogPost.Entities;

namespace BlogPost.Interfaces;

public interface IPortfolioRepository
{
    Task<List<Stock>> GetUSerPortfolio(AppUser user);
    Task<Portfolio> CreatePortfolioAsync(Portfolio portfolio);
    Task<Portfolio> DeletePortfolioAsync(AppUser appUser, string symbol);
    
}