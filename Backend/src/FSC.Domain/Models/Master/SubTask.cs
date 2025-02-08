using FSC.Domain.Validator.Master;

namespace FSC.Domain.Models.Master;

public class SubTask: BaseEntity
{
    
    public string Name { get; set; } = string.Empty; 
    public string Description { get; set; } = string.Empty;

    public long AircraftTypeId { get; set; } = 1;
    public long MajorTaskId { get; set; } = 1;
    public long? ParentTaskId { get; set; } = null;

    public static SubTask Create(string name, string description)
    {
        var task = new SubTask()
        {
            Name = name,
            Description = description
        };

        var validator = new SubTaskValidator();

        var response = validator.Validate(task);

        if (response.IsValid)
            return task;

        var exception = new NotValidException("Validation Error");
        response.Errors.ForEach(vf => exception.ValidationErrors.Add(vf.ErrorMessage));

        throw exception;
    }

    public void Update(string name, string description, long majorTaskId, long? parentTaskId, long airCraftTypeId)
    {
        Name = name;
        Description = description;

        var validator = new SubTaskValidator();
        var response = validator.Validate(this);

        if (response.IsValid)
            return;
        var exception = new NotValidException("Validation Error");
        response.Errors.ForEach((vf) => exception.ValidationErrors.Add(vf.ErrorMessage));

        throw exception;
    }
}
