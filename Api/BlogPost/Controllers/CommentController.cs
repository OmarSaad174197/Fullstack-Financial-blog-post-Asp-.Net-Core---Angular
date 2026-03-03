using BlogPost.DTOs.Comment;
using BlogPost.Entities;
using BlogPost.Extesions;
using BlogPost.Interfaces;
using BlogPost.Mappings;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BlogPost.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CommentController : ControllerBase
{
    private readonly ICommentRepository _commentRepo;
    // this is for the relation 1-1 between comment and user
    private readonly UserManager<AppUser> _userManager;
    private readonly IStockRepository _stockRepo;

    // DI by interface for separation of concern and easy to maintain the code
    public CommentController(
        ICommentRepository commentRepo, UserManager<AppUser> userManager
        , IStockRepository stockRepo)
    {
        _commentRepo = commentRepo;
        _userManager = userManager;
        _stockRepo = stockRepo;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllComments()
    {
        // Validation for ModelState(it comes from controller base) (all data annotations in dtos)
        if (!ModelState.IsValid) return BadRequest(ModelState);
        // Otherwise
        var comments = await _commentRepo.GetAllAsync();
        var commentDto = comments.Select(s => s.ToCommentDto());
        return Ok(commentDto);
    }

    [HttpGet]
    [Route("{id:int}")]
    public async Task<IActionResult> GetCommentById([FromRoute]int id)
    {
        // Validation for ModelState(it comes from controller base) (all data annotations in dtos)
        if (!ModelState.IsValid) return BadRequest(ModelState);
        // Otherwise
        var comment = await _commentRepo.GetByIdAsync(id);
        // Validate nullable
        if(comment == null) return NotFound();
        return Ok(comment.ToCommentDto());
    }

    [HttpPost]
    [Route("{stockId:int}")]
    public async Task<IActionResult> AddComment([FromRoute] int stockId, CreateCommentDto commentDto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        // Check stock existence for 1-1 relation between comment and user
        if(!await _stockRepo.StockExists(stockId)) return BadRequest("Stock does not exist");

        var username = User.GetUSerName();
        var appUser = await _userManager.FindByNameAsync(username);
        
        // These are for add a comment
        // Mapping comment into regular comment
        var commentModel = commentDto.ToCommentFromCreate(stockId);
        commentModel.UserId = appUser.Id;
        await _commentRepo.AddAsync(commentModel);
        return CreatedAtAction
            (nameof(GetCommentById), new { id = commentModel.Id }, commentModel.ToCommentDto());
    }

    [HttpPut]
    [Route("{id:int}")]
    public async Task<IActionResult> UpdateComment([FromRoute] int id, [FromBody] UpdateCommentDto commentDto)
    {
        // Validation for ModelState(it comes from controller base) (all data annotations in dtos)
        if (!ModelState.IsValid) return BadRequest(ModelState);
        // Otherwise
        var comment = await _commentRepo.UpdateAsync(id, commentDto.ToCommentFromUpdate());
        // Check nullability    
        if (comment == null) return NotFound("Comment does not exist");
        return Ok(comment.ToCommentDto());
    }

    [HttpDelete]
    [Route("{id:int}")]
    public async Task<IActionResult> DeleteComment([FromRoute] int id)
    {
        // Validation for ModelState(it comes from controller base) (all data annotations in dtos)
        if (!ModelState.IsValid) return BadRequest(ModelState);
        // Otherwise
        var commentModel = await _commentRepo.DeleteAsync(id);
        // Check nullability
        if (commentModel == null) return NotFound("Comment does not exist");
        
        return NoContent();
    }
    
}