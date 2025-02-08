using FSC.Domain.Models.Master;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSC.Application.Models.Dots.Master.Employees
{
    public class EmployeeDto
    {
        public string EmployeeId { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        [EmailAddress]
        public string Email { get; set; }
        public WorkingShift Shift { get; set; }
        public string FirstSupId { get; set; }
        public long? PositionId { get; set; }
    }
}
