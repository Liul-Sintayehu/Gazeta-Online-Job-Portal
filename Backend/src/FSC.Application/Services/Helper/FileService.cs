using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;

namespace FSC.Application.Services.Helper;

public interface IFileStorageService
{
    Task<string> UploadFileAsync(IFormFile file, string subFolder);
    Task<string> UpdateFileAsync(string existingFilePath, IFormFile newFile, string subFolder);
    Task<bool> DeleteFileAsync(string filePath);
    Task<bool> DeleteRangeFilesAsync(IEnumerable<string> filePaths);
}

public class LocalFileStorageService : IFileStorageService
{
    private const string UploadFolder = "Uploads";

    // Allowed extensions for file upload
    private static readonly List<string> AllowedExtensions =
    [
        ".jpg", ".gif", ".jpeg", ".png", ".pdf",
        ".doc", ".docx", ".xls", ".xlsx", ".txt"
    ];

    // Allowed MIME types for file upload
    private static readonly List<string> AllowedMimeTypes =
    [
        "image/jpeg", "image/gif", "image/png", "application/pdf",
        "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-powerpoint", "application/zip"
    ];

    private const long MaxFileSize = 5 * 1024 * 1024;

    private readonly string _uploadPath;

    public LocalFileStorageService(IHostEnvironment env)
    {
        _uploadPath = Path.Combine(env.ContentRootPath, UploadFolder);

        if (!Directory.Exists(_uploadPath)) Directory.CreateDirectory(_uploadPath);
    }

    public async Task<string> UploadFileAsync(IFormFile file, string subFolder)
    {
        if (file == null || file.Length == 0)
            throw new ArgumentException("File is empty or null");

        // Validate file extension
        ValidateFile(file);

        // Ensure the subfolder path exists
        var subFolderPath = Path.Combine(_uploadPath, subFolder);
        if (!Directory.Exists(subFolderPath)) Directory.CreateDirectory(subFolderPath);

        // Generate a unique file name
        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
        var filePath = Path.Combine(subFolderPath, fileName);

        // Save the file to the specified folder
        await using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Return the relative path to the file
        var relativeUrl = Path.Combine(UploadFolder, subFolder, fileName).Replace("\\", "/");
        return "/" + relativeUrl;
    }

    public async Task<string> UpdateFileAsync(string existingFilePath, IFormFile newFile, string subFolder)
    {
        if (newFile.Length == 0)
            return existingFilePath;

        ValidateFile(newFile);

        var subFolderPath = Path.Combine(_uploadPath, subFolder);
        if (!Directory.Exists(subFolderPath)) Directory.CreateDirectory(subFolderPath);

        // Generate a new file name for the updated file
        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(newFile.FileName);
        var newFilePath = Path.Combine(subFolderPath, fileName);

        // Save the new file
        await using (var stream = new FileStream(newFilePath, FileMode.Create))
        {
            await newFile.CopyToAsync(stream);
        }

        // Delete the old file if it exists
        var oldFilePath = Path.Combine(_uploadPath, Path.GetFileName(existingFilePath.TrimStart('/')));
        if (File.Exists(oldFilePath)) File.Delete(oldFilePath);

        // Return the relative URL of the new file
        var relativeUrl = Path.Combine(UploadFolder, subFolder, fileName).Replace("\\", "/");
        return "/" + relativeUrl;
    }

    public Task<bool> DeleteFileAsync(string filePath)
    {
        if (string.IsNullOrEmpty(filePath))
            return Task.FromResult(false);

        var absoluteFilePath = Path.Combine(_uploadPath, Path.GetFileName(filePath.TrimStart('/')));

        if (!File.Exists(absoluteFilePath)) return Task.FromResult(false);

        File.Delete(absoluteFilePath);
        return Task.FromResult(true);
    }

    public async Task<bool> DeleteRangeFilesAsync(IEnumerable<string> filePaths)
    {
        var allDeleted = true;

        foreach (var filePath in filePaths)
        {
            var isDeleted = await DeleteFileAsync(filePath);
            allDeleted = allDeleted && isDeleted;
        }

        return allDeleted;
    }

    // Helper method to validate file
    private static void ValidateFile(IFormFile file)
    {
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        // Validate file size
        if (file.Length > MaxFileSize)
            throw new ArgumentException($"File size exceeds the maximum limit of {MaxFileSize / (1024 * 1024)} MB.");

        // Validate file extension
        if (!AllowedExtensions.Contains(extension))
            throw new ArgumentException(
                $"File extension '{extension}' is not allowed. Allowed extensions are: {string.Join(", ", AllowedExtensions)}.");

        // Validate MIME type
        if (!AllowedMimeTypes.Contains(file.ContentType))
            throw new ArgumentException(
                $"File type '{file.ContentType}' is not allowed. Allowed types are: {string.Join(", ", AllowedMimeTypes)}.");
    }
}