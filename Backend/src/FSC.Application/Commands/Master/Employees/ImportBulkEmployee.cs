using FSC.Application.Models.Dtos.Master.Employees;
using FSC.Application.Services.Helper;
using FSC.Application.Services.UnitOfWork;
using FSC.Domain.Models.Master;
using Microsoft.AspNetCore.Http;
using OfficeOpenXml;

namespace FSC.Application.Commands.Master.Employees;

public record ImportBulkEmployee(IFormFile ExcelFile) : IRequest<OperationResult<List<Employee>>>;

internal class ImportBulkEmployeeHandler(
    IUnitOfWork unitOfWork,
    IRepositoryBase<Employee> employeeRepo,
    IRepositoryBase<Position> positionRepo, 
    UserService userService)
    : IRequestHandler<ImportBulkEmployee, OperationResult<List<Employee>>>
{
    public async Task<OperationResult<List<Employee>>> Handle(ImportBulkEmployee req,
        CancellationToken cancellationToken)
    {
        var result = new OperationResult<List<Employee>>();
        var allowedExtensions = new[] { ".xlsx", ".xls" };

        List<Employee> employeeList = [];
        List<EmployeeBulkDto> employeeBulkList = [];

        if (req.ExcelFile.Length == 0 ||
            !allowedExtensions.Contains(Path.GetExtension(req.ExcelFile.FileName).ToLowerInvariant()))
        {
            result.AddError(ErrorCode.ValidationError, "Invalid file upload.");
            return result;
        }

        try
        {
            // Get the authenticated user
            var currentUser = await userService.GetCurrentUserAsync(cancellationToken);
            var userFullName =
                $"{currentUser.FirstName} {currentUser.MiddleName} {currentUser.LastName} ({currentUser.EmployeeId})";
            
            var positions = await positionRepo
                .Where(e => e.RecordStatus == RecordStatus.Active)
                .ToListAsync(cancellationToken);

            await using (var stream = req.ExcelFile.OpenReadStream())
            {
                using (var package = new ExcelPackage(stream))
                {
                    var worksheet = package.Workbook.Worksheets.FirstOrDefault();
                    if (worksheet == null)
                    {
                        result.AddError(ErrorCode.ValidationError, "No worksheet found in the Excel file.");
                        return result;
                    }

                    try
                    {
                        for (var row = 2; row <= worksheet.Dimension.Rows; row++)
                        {
                            var bulkEmployee = new EmployeeBulkDto
                            {
                                EmployeeId = worksheet.Cells[row, 1].Value?.ToString()
                                             ?? throw new InvalidOperationException(
                                                 $"Employee Id is null at row {row - 1}"),
                                FirstName = worksheet.Cells[row, 2].Value?.ToString()
                                            ?? throw new InvalidOperationException(
                                                $"First Name is null at row {row - 1}"),
                                MiddleName = worksheet.Cells[row, 3].Value?.ToString()
                                             ?? throw new InvalidOperationException(
                                                 $"Middle Name is null at row {row - 1}"),
                                LastName = worksheet.Cells[row, 4].Value?.ToString()
                                           ?? throw new InvalidOperationException(
                                               $"Last Name is null at row {row - 1}"),
                                Email = worksheet.Cells[row, 5].Value?.ToString()
                                        ?? throw new InvalidOperationException($"Email is null at row {row - 1}"),
                                Shift = worksheet.Cells[row, 6].Value?.ToString()
                                        ?? string.Empty,
                                FirstSupId = worksheet.Cells[row, 7].Value?.ToString()
                                             ?? string.Empty,
                                Position = worksheet.Cells[row, 8].Value?.ToString()
                                           ?? throw new InvalidOperationException($"Position is null at row {row - 1}")
                            };
                            employeeBulkList.Add(bulkEmployee);
                        }
                    }
                    catch (InvalidOperationException ioe)
                    {
                        result.AddError(ErrorCode.ValidationError, ioe.Message);
                        return result;
                    }
                }
            }

            for (var i = 0; i < employeeBulkList.Count; i++)
            {
                var employeeBulk = employeeBulkList[i];
                if (employeeBulk.EmployeeId.All(char.IsDigit)) continue;

                result.AddError(ErrorCode.ValidationError, $"Invalid employee ID at row {i + 1}");
                return result;
            }


            if (HasDuplicates(employeeBulkList))
            {
                result.AddError(ErrorCode.ValidationError, "The file contains duplicate Employee IDs.");
                return result;
            }

            foreach (var (employeeBulk, index) in employeeBulkList.Select((emp, index) => (emp, index + 1)))
            {
                // Let's assume Day is the Default Shift
                var employeeShift = employeeBulk.Shift.ToLower() switch
                {
                    "day" => WorkingShift.Day,
                    "evening" => WorkingShift.Evening,
                    "night" => WorkingShift.Night,
                    _ => WorkingShift.Day
                };
                
                var position = positions.FirstOrDefault(pos => pos.Name == employeeBulk.Position);

                long? employeePositionId = null;
                if (position is not null)
                    employeePositionId = position.Id;
                else
                    result.AddError(ErrorCode.ValidationError, $"Position not found for row number'{index}'!");

                // if validation error is found, break and return Error
                if (result.IsError) return result;

                employeeList.Add(
                    Employee.Create
                    (
                        employeeBulk.EmployeeId,
                        employeeBulk.FirstName,
                        employeeBulk.MiddleName,
                        employeeBulk.LastName,
                        employeeBulk.Email,
                        employeeShift,
                        employeeBulk.FirstSupId,
                        employeePositionId,
                        userFullName
                    )
                );
            }
            
            var existingEmployees = await employeeRepo
                .Where(e => e.RecordStatus != RecordStatus.Deleted &&
                            employeeList.Select(c => c.EmployeeId).Contains(e.EmployeeId))
                .ToListAsync(cancellationToken);

            if (existingEmployees.Count != 0)
            {
                result.AddError(ErrorCode.ValidationError, "The Excel file contains already registered employees.");
                return result;
            }

            await employeeRepo.AddRangeAsync(employeeList);
            await unitOfWork.CommitAsync();

            result.Payload = employeeList;
            result.Message = "Operation successful.";
            return result;
        }
        catch (UnregisteredUserException ex)
        {
            result.AddError(ErrorCode.UnAuthorized, ex.Message);
        }
        catch (NotValidException nve)
        {
            await unitOfWork.RollbackAsync();
            result.AddError(ErrorCode.ValidationError, nve.Message);
            
        }
        catch (Exception ex)
        {
            await unitOfWork.RollbackAsync();
            result.AddError(ErrorCode.UnknownError, "Data was not saved. Please check your file and try again.");
            result.Message = ex.Message;
        }
            
        return result;
    }

    private static bool HasDuplicates(List<EmployeeBulkDto> bulkEmployeeList)
    {
        return bulkEmployeeList
            .GroupBy(emp => emp.EmployeeId)
            .Any(group => group.Count() > 1);
    }
}