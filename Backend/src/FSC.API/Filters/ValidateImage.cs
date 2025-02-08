using System.ComponentModel.DataAnnotations;

namespace FSC.API.Filters;

public class AllowedExtensionsAttribute(string[] extensions) : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        var file = value as IFormFile;
        var extension = Path.GetExtension(file?.FileName);
        return !extensions.Contains(extension?.ToLower()) ? new ValidationResult(GetErrorMessage()) : ValidationResult.Success;
    }

    private static string GetErrorMessage()
    {
        return $"The Uploaded filetype is not valid.";
    }
}