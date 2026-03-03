using BlogPost.Entities;
using BlogPost.Extesions;
using BlogPost.Interfaces;
using BlogPost.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BlogPost.Controllers;
[Route("api/[controller]")]
[ApiController]
public class PortfolioController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    private readonly IStockRepository _stockRepository;
    private readonly IPortfolioRepository _portfolioRepository;

    public PortfolioController
        (UserManager<AppUser> userManager, IStockRepository stockRepository, IPortfolioRepository portfolioRepository)
    {
        _userManager = userManager;
        _stockRepository = stockRepository;
        _portfolioRepository = portfolioRepository;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetUserPortfolio()
    {
        var username = User.GetUSerName();
        var appUser = await _userManager.FindByNameAsync(username);
        var userPortfolio = await _portfolioRepository.GetUSerPortfolio(appUser);
        return Ok(userPortfolio);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> AddPortfolio(string symbol)
    {
        var username = User.GetUSerName();
        var appUser = await _userManager.FindByNameAsync(username);
        var stock = await _stockRepository.GetBySymbolAsync(symbol);
        
        // validate if stock is not exist
        if (stock == null) return BadRequest("stock not found");

        var userPortfolio = await _portfolioRepository.GetUSerPortfolio(appUser);
        // Validate the user portfolio
        if(userPortfolio.Any(p =>p.Symbol.ToLower() == symbol.ToLower()))
            return BadRequest("invalid symbol");
        
        // Crate object from portfolio
        var portfolioModel = new Portfolio
        {
            StockId = stock.Id,
            AppUserId = appUser.Id
        };
        // create the portfolio
        await _portfolioRepository.CreatePortfolioAsync(portfolioModel);
        if (portfolioModel == null)
        {
            return StatusCode(500,"Portfolio could not be created");
        }
        else
        {
            return Created();
        }
    }

    [HttpDelete]
    [Authorize]
    public async Task<IActionResult> DeletePortfolio(string symbol)
    {
        var username = User.GetUSerName();
        var appUser = await _userManager.FindByNameAsync(username);
        
        var userPortfolio = await _portfolioRepository.GetUSerPortfolio(appUser);
        if (userPortfolio == null) return BadRequest("Portfolio not found");
        
        var filteredStock = userPortfolio.Where(u => u.Symbol.ToLower() == symbol.ToLower());
        if (filteredStock.Count() == 1)
        {
           await _portfolioRepository.DeletePortfolioAsync(appUser, symbol);
        }
        else
        {
            return BadRequest("Stock not in your portfolio");
        }

        return StatusCode(200,"Portfolio deleted");
    }
    
    
}