using BlogPost.Data;
using BlogPost.Entities;
using BlogPost.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BlogPost.Repositories;

public class CommentRepository : ICommentRepository
{
    private readonly AppDbContext _context;

    public CommentRepository(AppDbContext context)
    {
        _context = context;
    }
    public async Task<IEnumerable<Comment>> GetAllAsync()
    {
        return await _context.Comments.Include(a => a.AppUser).ToListAsync();
    }

    public async Task<Comment?> GetByIdAsync(int id)
    {
        // include to include user into comment
        var comment = await _context.Comments.Include(a => a.AppUser).FirstOrDefaultAsync(c => c.Id == id);
        if (comment == null)
        {
            return null;
        }
        return comment;
    }

    public async Task<Comment?> AddAsync(Comment commentModel)
    {
        await _context.Comments.AddAsync(commentModel);
        await _context.SaveChangesAsync();
        return commentModel;
    }

    public async Task<Comment?> UpdateAsync(int id, Comment commentModel)
    {
        var existingComment = await _context.Comments.FindAsync(id);
        if (existingComment == null)
            return null;
        
        existingComment.Title = commentModel.Title;
        existingComment.Content = commentModel.Content;
        
        await _context.SaveChangesAsync();
        return existingComment;
    }

    public async Task<Comment?> DeleteAsync(int id)
    {
        var commentModel = await _context.Comments.FirstOrDefaultAsync(X => X.Id == id);
        
        if (commentModel == null) 
            return null;
        
        _context.Entry(commentModel).State = EntityState.Deleted;
        
        await _context.SaveChangesAsync();
        
        return commentModel;
    }
}