using System.ComponentModel.DataAnnotations.Schema;

namespace FSC.Domain.Models.EmployeeAssignments;

public class Post : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Location { get; set; } = string.Empty;
    public long? ParentPostId { get; set; }
    [ForeignKey(nameof(ParentPostId))]
    public Post? ParentPost { get; set; }
    
    public static Post Create(string code, string description, string? location, long? parentPostId )
    {
        var newPost = new Post
        {
            Location = location,
            Code = code,
            Description = description,
            ParentPostId = parentPostId
        };

        newPost.Register();
        return newPost;
    }

    public void Update(string code, string description, string? location, long? parentPostId)
    {
        Location = location;
        Code = code;
        Description = description;
        ParentPostId = parentPostId;
        
        UpdateAudit();
    }
}