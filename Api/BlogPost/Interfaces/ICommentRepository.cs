using BlogPost.Entities;

namespace BlogPost.Interfaces;

public interface ICommentRepository
{
    Task<IEnumerable<Comment>> GetAllAsync();
    Task<Comment?>GetByIdAsync(int id);
    Task<Comment?> AddAsync(Comment commentModel);
    Task<Comment?> UpdateAsync(int id, Comment commentModel);
    Task<Comment?> DeleteAsync(int id);
}