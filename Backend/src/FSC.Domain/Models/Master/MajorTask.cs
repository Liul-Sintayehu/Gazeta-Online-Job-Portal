using FSC.Domain.Validator.Master;

namespace FSC.Domain.Models.Master;

public class MajorTask(string name, string description) : BaseEntity
{
    public string Name { get; private set; } = name;
    public string Description { get; private set; } = description;
    // Navigation property for related tasks
    // public List<SubTask> SubTask { get; private set; } = [];

    public static MajorTask Create(string name, string description)
    {
        var majorTask = new MajorTask(name, description);

        var validator = new MajorTaskValidator();
        var response = validator.Validate(majorTask);

        if (response.IsValid)
            return majorTask;

        var exception = new NotValidException("Validation Error");
        response.Errors.ForEach(vf => exception.ValidationErrors.Add(vf.ErrorMessage));
        throw exception;
    }

    public void Update(string name, string description)
    {
        this.Name = name;
        this.Description = description;

        var validator = new MajorTaskValidator();
        var response = validator.Validate(this);

        if (response.IsValid)
            return;

        var exception = new NotValidException("Validation Error");
        response.Errors.ForEach(vf => exception.ValidationErrors.Add(vf.ErrorMessage));
        throw exception;
    }
}
