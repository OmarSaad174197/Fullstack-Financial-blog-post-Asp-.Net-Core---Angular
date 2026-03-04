using BlogPost.Data;
using BlogPost.DTOs.Stock;
using BlogPost.Entities;
using BlogPost.Helper;
using BlogPost.Mappings;
using BlogPost.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BlogPost.Controllers;
[Route("api/[controller]")]
[ApiController]
// This is for security
// [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class StockController: ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IStockRepository _stockRepository;

    // DI by interface for separation of concern and easy to maintain the code
    public StockController(AppDbContext context, IStockRepository stockRepository)
    {
        _context = context;
        _stockRepository = stockRepository;
    }
    [HttpGet]
    // I used routing [FromQuery] for filtering and get data from query string like that:
    // ? Symbol = ...
    public async Task <IActionResult> GetAllStocks([FromQuery] QueryObject query)
    {
        // Validation for ModelState(it comes from controller base) (all data annotations in dtos)
        if (!ModelState.IsValid) return BadRequest(ModelState);
        // Otherwise
        var stocks = await _stockRepository.GetAllAsync(query);
        var stockDto = stocks. Select(s => s.ToStockDto()).ToList();
        return Ok(stockDto);
    }

    [HttpGet]
    [Route("{id:int}")]
    public async Task<IActionResult> GetStockById([FromRoute] int id)
    {
        // Validation for ModelState(it comes from controller base) (all data annotations in dtos)
        if (!ModelState.IsValid) return BadRequest(ModelState);
        // Otherwise
        var stock = await _stockRepository.GetByIdAsync(id);
        if (stock == null) return NotFound();
        return Ok(stock.ToStockDto());
    }

    [HttpPost]
    public async Task<IActionResult> CreateStock([FromBody] AddStockDto addStockDto)
    {
        // Validation for ModelState(it comes from controller base) (all data annotations in dtos)
        if (!ModelState.IsValid) return BadRequest(ModelState);
        // Otherwise
        var stock = addStockDto.ToStockFromCreateDto();
        await _stockRepository.CreateAsync(stock);
        return CreatedAtAction(nameof(GetStockById), new {id = stock.Id}, stock.ToStockDto());
    }

    [HttpPut]
    [Route("{id:int}")]
    public async Task<IActionResult> UpdateStock([FromRoute] int id, [FromBody] UpdateStockDto updateStockDto)
    {
        // Validation for ModelState(it comes from controller base) (all data annotations in dtos)
        if (!ModelState.IsValid) return BadRequest(ModelState);
        // Otherwise
        var stockModel = await _stockRepository.UpdateAsync(id, updateStockDto);
        //Validate if the stock exist
        if (stockModel == null) return NotFound();
        return Ok(stockModel.ToStockDto());
    }

    [HttpDelete]
    [Route("{id:int}")]
    public async Task<IActionResult> DeleteStock([FromRoute] int id)
    {
        // Validation for ModelState(it comes from controller base) (all data annotations in dtos)
        if (!ModelState.IsValid) return BadRequest(ModelState);
        // Otherwise
        var stockModel = await _stockRepository.DeleteAsync(id);
        if(stockModel == null) return NotFound();
        return NoContent();
    }
}
