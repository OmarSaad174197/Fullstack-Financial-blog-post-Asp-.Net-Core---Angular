using BlogPost.DTOs.Comment;
using BlogPost.Entities;

namespace BlogPost.Mappings;

public static class CommentMapper
{
    public static CommentDto ToCommentDto(this Comment commentModel)
    {
        return new CommentDto()
        {
            Id = commentModel.Id,
            Title = commentModel.Title,
            Content = commentModel.Content,
            CreatedOn = commentModel.CreatedOn,
            CreatedBy = commentModel.AppUser?.UserName ?? string.Empty,
            StockId = commentModel.StockId
        };
    }
    public static Comment ToCommentFromCreate(this CreateCommentDto createCommentDto, int stockId)
    {
        return new Comment
        {
            Title = createCommentDto.Title,
            Content = createCommentDto.Content,
            StockId = stockId
        };
    }

    public static Comment ToCommentFromUpdate( this UpdateCommentDto commentDto)
    {
        return new Comment()
        {
            Title = commentDto.Title,
            Content = commentDto.Content
        };
    }
}
