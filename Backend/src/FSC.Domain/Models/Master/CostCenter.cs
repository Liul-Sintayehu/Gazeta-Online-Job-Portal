namespace FSC.Domain.Models.Master
{
    public class CostCenter : BaseEntity
    {
        public string Name { get; private set; } = string.Empty;
        public string Description { get; private set; } = string.Empty;

        public static CostCenter Create(string name, string description)
        {
            var costCenter = new CostCenter { Name = name, Description = description };

            var validator = new CostCenterValidator();
            var response = validator.Validate(costCenter);
            if (response.IsValid) return costCenter;// valid
            
            var exception = new NotValidException("Cost center is not valid");
            response.Errors.ForEach(vr => exception.ValidationErrors.Add(vr.ErrorMessage));
            throw exception;
        }
        public void Update(string name, string description)
        {
            Name = name;
            Description = description;

            var validator = new CostCenterValidator();
            var response = validator.Validate(this);
            if (response.IsValid) return;//valid
            var exception = new NotValidException("Cost center is not valid");
            response.Errors.ForEach(vr => exception.ValidationErrors.Add(vr.ErrorMessage));
            throw exception;
        }
    }
}
