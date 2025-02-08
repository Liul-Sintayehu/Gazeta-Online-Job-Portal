using FSC.Domain.Validator.Master;
namespace FSC.Domain.Models.Master
{
    public class Position(string name, string description) : BaseEntity
    {
        public string Name { get; set; } = name;
        public string Description { get; set; } = description;

        public static Position Create(string name, string description)
        {
            var position = new Position(name, description);

            var validator = new PositionValidator();
            var response = validator.Validate(position);
            
            if (response.IsValid) return position;
            
            var exception = new NotValidException("Model is not valid");
            response.Errors.ForEach(vr => exception.ValidationErrors.Add(vr.ErrorMessage));
            throw exception;
        }
        public void Update(string name, string description)
        {
            this.Name = name;
            this.Description = description;

            var validator = new PositionValidator();
            var response = validator.Validate(this);
            
            if (response.IsValid) return;
            
            var exception = new NotValidException("Model is not valid");
            response.Errors.ForEach(vr => exception.ValidationErrors.Add(vr.ErrorMessage));
            throw exception;
        }
    }
}
