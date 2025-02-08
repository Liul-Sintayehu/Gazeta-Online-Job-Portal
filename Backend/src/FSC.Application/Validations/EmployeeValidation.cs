//using Microsoft.AspNetCore.Http;

//namespace FSC.Application.Validations
//{
//    public class EmployeeValidation
//    {
//        private readonly IRepositoryBase<Employee> _employee;
//        public EmployeeValidation(IRepositoryBase<Employee> _employee)
//        {
//            this._employee = _employee;
//        }
//        public string EmployeeValidations(string firstName, string middleName, string lastName, string email, string gender, string phoneNumber,
//       string nationality, string employeeId, EmploymentType? employmentType, DateTime SeniorityDate, IFormFile image, List<EmployeeCustomField>? employeeCustomFields, string userName)
//        {
//            if (string.IsNullOrEmpty(firstName))
//                return "First Name is required.";
//            if (string.IsNullOrEmpty(middleName))
//                return "Middle Name is required.";
//            if (string.IsNullOrEmpty(lastName))
//                return "Last Name is required.";

//            if (SeniorityDate > DateTime.Now)
//                return "Seniority date can't be greater than today.";

//            if (employeeCustomFields?.Count > 0)
//                foreach (var f in employeeCustomFields)
//                {
//                    if (CheckForDuplicateInEmployees(f.Value))
//                        return "Duplicate values in custom field found.";
//                }
//            return string.Empty;
//        }
//        static bool CheckForDuplicateInEmployees(string input)
//        {
//            string[] listElements = input.Split(',');
//            bool hasDuplicates = listElements
//                .GroupBy(e => e)
//                .Any(group => group.Count() > 1);

//            return hasDuplicates;
//        }
//    }
//}
