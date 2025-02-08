using FSC.Domain.Models.Master;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSC.Domain.Validator.Master
{
    public class EmployeeValidator : AbstractValidator<Employee>
    {
        public EmployeeValidator()
        {

            RuleFor(x => x.EmployeeId)
                  .NotNull().WithMessage("Employee ID can't be null")
                  .NotEmpty().WithMessage("Employee ID can't be empty");

            RuleFor(x => x.FirstName)
                 .NotNull().WithMessage("Employee First Name can't be null")
                 .NotEmpty().WithMessage("Employee Last Name can't be empty");

            RuleFor(x => x.MiddleName)
                 .NotNull().WithMessage("Employee Middle Name can't be null")
                 .NotEmpty().WithMessage("Employee Middle Name can't be empty");
        }
    }
}
