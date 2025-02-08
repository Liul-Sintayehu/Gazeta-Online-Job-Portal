//using FSC.Application.Models.Dtos.EmployeeCustomFields;

//namespace FSC.Application.Methods
//{
//    public class EmployeeSearch
//    {
//        private readonly IRepositoryBase<EmployeeCustomField> _employeeCustomFields;
//        public EmployeeSearch(IRepositoryBase<EmployeeCustomField> _employeeCustomFields)
//        {
//            this._employeeCustomFields = _employeeCustomFields;
//        }
//        public IQueryable<Employee> ApplySearchParameters(IQueryable<Employee> employees, string? employeeId, string? firstName, string? middleName, string? lastName, long? costCenterId, EmploymentType? employmentType, List<EmployeeCustomFieldCreateDto>? employeeCustomFields)
//        {
//            if (!string.IsNullOrEmpty(employeeId))
//                employees = employees.Where(e => e.EmployeeId.Contains(employeeId));
//            if (!string.IsNullOrEmpty(firstName))
//                employees = employees.Where(e => e.FirstName.Contains(firstName));
//            if (!string.IsNullOrEmpty(middleName))
//                employees = employees.Where(e => e.MiddleName.Contains(middleName));
//            if (!string.IsNullOrEmpty(lastName))
//                employees = employees.Where(e => e.LastName.Contains(lastName));
//            if (employmentType > 0)
//                employees = employees.Where(e => e.EmploymentType == employmentType.Value);
//            if (employeeCustomFields?.Any() == true)
//            {
//                var employeeCustomFieldIds = employeeCustomFields.Select(cust => cust.CustomFieldId).ToList();
//                var employeeCustomFieldValues = employeeCustomFields.Select(cust => cust.Value).ToList();

//                var matchingEmployeeIds = _employeeCustomFields
//                    .Where(ecf => employeeCustomFieldIds.Contains(ecf.CustomFieldId) && ecf.RecordStatus == RecordStatus.Active)
//                    .AsEnumerable()  // Materialize data into memory
//                    .Where(ecf => employeeCustomFieldValues.Any(value => ecf.Value.Contains(value)))
//                    .Select(ecf => ecf.EmployeeId).Distinct().ToList();

//                employees = employees.Where(emp => matchingEmployeeIds.Contains(emp.Id));
//            }
//            return employees;
//        }
//    }
//}
