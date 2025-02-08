using FSC.Domain.Validator.Master;

namespace FSC.Domain.Models.Master
{
    public class AircraftType(string aircraftTypeCode, string aircraftTypeName) : BaseEntity
    {
        public string AircraftTypeCode { get; set; } = aircraftTypeCode;
        public string AircraftTypeName { get; set; } = aircraftTypeName;

        public static AircraftType Create(string aircraftTypeCode, string aircraftTypeName, string createdBy)
        {
            var aircraftType =new AircraftType(aircraftTypeCode, aircraftTypeName);

            var validator = new AircraftTypeValidator();
            var response = validator.Validate(aircraftType);
            
            if (response.IsValid)
            {
                aircraftType.Register(createdBy);
                return aircraftType;
            }
            
            var exception = new NotValidException("Model is not valid");
            response.Errors.ForEach(vr => exception.ValidationErrors.Add(vr.ErrorMessage));
            throw exception;
        }
        public void Update(string aircraftTypeCode, string aircraftTypeName)
        {
            this.AircraftTypeCode = aircraftTypeCode;
            this.AircraftTypeName = aircraftTypeName;

            var validator = new AircraftTypeValidator();
            var response = validator.Validate(this);
            if (response.IsValid) return;
            
            var exception = new NotValidException("Model is not valid");
            response.Errors.ForEach(vr => exception.ValidationErrors.Add(vr.ErrorMessage));
            throw exception;
        }
    }
}
