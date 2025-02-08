using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Reflection;
using System.Web.Http.ModelBinding;
using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Net.Http.Headers;

namespace FSC.Application.Helpers
{
    public static class FileHelpers
    {
        // If you require a check on specific characters in the IsValidFileExtensionAndSignature
        // method, supply the characters in the _allowedChars field.
        private static readonly byte[] _allowedChars = { };
        // For more file signatures, see the File Signatures Database (https://www.filesignatures.net/)
        // and the official specifications for the file types you wish to add.
        private static readonly Dictionary<string, List<byte[]>> _fileSignature = new Dictionary<string, List<byte[]>>
        {
            { ".gif", new List<byte[]> { new byte[] { 0x47, 0x49, 0x46, 0x38 } } },
            { ".png", new List<byte[]> { new byte[] { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A } } },
            { ".jpeg", new List<byte[]>
                {
                    new byte[] { 0xFF, 0xD8, 0xFF, 0xE0 },
                    new byte[] { 0xFF, 0xD8, 0xFF, 0xE2 },
                    new byte[] { 0xFF, 0xD8, 0xFF, 0xE3 },
                }
            },
            { ".jpg", new List<byte[]>
                {
                    new byte[] { 0xFF, 0xD8, 0xFF, 0xE0 },
                    new byte[] { 0xFF, 0xD8, 0xFF, 0xE1 },
                    new byte[] { 0xFF, 0xD8, 0xFF, 0xE8 },
                }
            },
            { ".zip", new List<byte[]>
                {
                    new byte[] { 0x50, 0x4B, 0x03, 0x04 },
                    new byte[] { 0x50, 0x4B, 0x4C, 0x49, 0x54, 0x45 },
                    new byte[] { 0x50, 0x4B, 0x53, 0x70, 0x58 },
                    new byte[] { 0x50, 0x4B, 0x05, 0x06 },
                    new byte[] { 0x50, 0x4B, 0x07, 0x08 },
                    new byte[] { 0x57, 0x69, 0x6E, 0x5A, 0x69, 0x70 },
                }
            },
             { ".pdf", new List<byte[]>
                {
                    new byte[] { 0x25, 0x50, 0x44, 0x46 },

                }
            },
        };
        // **WARNING!**
        // In the following file processing methods, the file's content isn't scanned.
        // In most production scenarios, an anti-virus/anti-malware scanner API is
        // used on the file before making the file available to users or other
        // systems. For more information, see the topic that accompanies this sample
        // app.
        public static async Task<byte[]> ProcessFormFile<T>(IFormFile formFile,
            ModelStateDictionary modelState, string[] permittedExtensions,
            long sizeLimit)
        {
            var fieldDisplayName = string.Empty;
            // Use reflection to obtain the display name for the model
            // property associated with this IFormFile. If a display
            // name isn't found, error messages simply won't show
            // a display name.
            MemberInfo property =
                typeof(T).GetProperty(
                    formFile.Name.Substring(formFile.Name.IndexOf(".",
                    StringComparison.Ordinal) + 1));

            if (property != null)
            {
                if (property.GetCustomAttribute(typeof(DisplayAttribute)) is
                    DisplayAttribute displayAttribute)
                {
                    fieldDisplayName = $"{displayAttribute.Name} ";
                }
            }
            // Don't trust the file name sent by the client. To display
            // the file name, HTML-encode the value.
            var trustedFileNameForDisplay = WebUtility.HtmlEncode(
                formFile.FileName);
            // Check the file length. This check doesn't catch files that only have 
            // a BOM as their content.
            if (formFile.Length == 0)
            {
                modelState.AddModelError(formFile.Name,
                    $"{fieldDisplayName}({trustedFileNameForDisplay}) is empty.");
                return new byte[0];
            }
            if (formFile.Length > sizeLimit)
            {
                var megabyteSizeLimit = sizeLimit / 1048576;
                modelState.AddModelError(formFile.Name,
                    $"{fieldDisplayName}({trustedFileNameForDisplay}) exceeds " +
                    $"{megabyteSizeLimit:N1} MB.");
                return new byte[0];
            }
            try
            {
                using (var memoryStream = new MemoryStream())
                {
                    await formFile.CopyToAsync(memoryStream);
                    // Check the content length in case the file's only
                    // content was a BOM and the content is actually
                    // empty after removing the BOM.
                    if (memoryStream.Length == 0)
                    {
                        modelState.AddModelError(formFile.Name,
                            $"{fieldDisplayName}({trustedFileNameForDisplay}) is empty.");
                    }

                    if (!IsValidFileExtensionAndSignature(
                        formFile.FileName, memoryStream, permittedExtensions))
                    {
                        modelState.AddModelError(formFile.Name,
                            $"{fieldDisplayName}({trustedFileNameForDisplay}) file " +
                            "type isn't permitted or the file's signature " +
                            "doesn't match the file's extension.");
                    }
                    else
                    {
                        return memoryStream.ToArray();
                    }
                }
            }
            catch (Exception ex)
            {
                modelState.AddModelError(formFile.Name,
                    $"{fieldDisplayName}({trustedFileNameForDisplay}) upload failed. " +
                    $"Please contact the Help Desk for support. Error: {ex.HResult}");
                // Log the exception
            }

            return new byte[0];
        }

        public static byte[] ToByteArray(this Stream input)
        {
            byte[] buffer = new byte[16 * 1024];
            using (var ms = new MemoryStream())
            {
                int read;
                while ((read = input.Read(buffer, 0, buffer.Length)) > 0)
                {
                    ms.Write(buffer, 0, read);
                }
                return ms.ToArray();
            }
        }
        public static async Task<byte[]> ProcessStreamedFile(
            MultipartSection section, ContentDispositionHeaderValue contentDisposition,
            ModelStateDictionary modelState, string[] permittedExtensions, long sizeLimit)
        {
            using (var memoryStream = new MemoryStream())
            {
                await section.Body.CopyToAsync(memoryStream);

                // Check if the file is empty or exceeds the size limit.
                if (memoryStream.Length == 0)
                {
                    modelState.AddModelError("File", "The file is empty.");
                }
                else if (memoryStream.Length > sizeLimit)
                {
                    var megabyteSizeLimit = sizeLimit / 1048576;
                    modelState.AddModelError("File",
                    $"The file exceeds {megabyteSizeLimit:N1} MB.");
                }
                else if (!IsValidFileExtensionAndSignature(
                    contentDisposition.FileName.Value, memoryStream,
                    permittedExtensions))
                {
                    modelState.AddModelError("File",
                        "The file type isn't permitted or the file's " +
                        "signature doesn't match the file's extension.");
                }
                else
                {
                    return memoryStream.ToArray();
                }
            }
            return new byte[0];
        }
        public static async Task<bool> UploadFileToStorage(Stream fileStream, string fileName, Settings settings)
        { // Create a URI to the blob 
            string url = "https://" + settings.azureStorageConfig.AccountName + ".blob.core.windows.net/" + settings.azureStorageConfig.ImageContainer + "/" + fileName;
            Uri blobUri = new Uri(url);
            // Create StorageSharedKeyCredentials object by reading the values from the configuration (appsettings.json) 
            StorageSharedKeyCredential storageCredentials = new StorageSharedKeyCredential("b2cappdevstorageaccount", "wizef3HEea4togALA8D/6MbCmT8z3qutN/BD2/chMNi2uI4y5uMd1/aBC1X4cj0kZ5m9Vy8S1mW2xIJeakFKJw==");
            // Create the blob client. 
            BlobClient blobClient = new BlobClient(blobUri, storageCredentials);
            blobClient.SetHttpHeaders(new BlobHttpHeaders { CacheControl = "max-age=2592000" }); //1 month
            // Upload the fileawait 
            var response = await blobClient.UploadAsync(fileStream);
            return await Task.FromResult(true);
        }
        public static async Task<string> UploadFileToAzureStorage(Stream fileStream, string fileName, Settings settings)
        {
            try
            {

                // Create a URI to the blob 
                string url = "https://" + settings.azureStorageConfig.AccountName + ".blob.core.windows.net/" + settings.azureStorageConfig.ImageContainer + "/" + fileName;
                Uri blobUri = new Uri(url);
                // Create StorageSharedKeyCredentials object by reading the values from the configuration (appsettings.json) 
                StorageSharedKeyCredential storageCredentials = new StorageSharedKeyCredential(settings.azureStorageConfig.AccountName, settings.azureStorageConfig.AccountKey);
                // Create the blob client. 
                BlobClient blobClient = new BlobClient(blobUri, storageCredentials);
                // Upload the fileawait 
                var response = await blobClient.UploadAsync(fileStream);
                blobClient.SetHttpHeaders(new BlobHttpHeaders { CacheControl = "max-age=2592000" }); //1 month

                return url;
            }
            catch (Exception ex)
            {

                return "";
            }
        }
        public static async Task<bool> addCacheToImage(List<string> imageURLs)
        {
            try
            {
                foreach (var item in imageURLs)
                {
                    Uri blobUri = new Uri(item);
                    StorageSharedKeyCredential storageCredentials = new StorageSharedKeyCredential("b2cappdevstorageaccount", "wizef3HEea4togALA8D/6MbCmT8z3qutN/BD2/chMNi2uI4y5uMd1/aBC1X4cj0kZ5m9Vy8S1mW2xIJeakFKJw==");
                    BlobClient blobClient = new BlobClient(blobUri, storageCredentials);
                    blobClient.SetHttpHeaders(new BlobHttpHeaders { CacheControl = "max-age=2592000" }); //1 month
                }
                return true;
            }
            catch (Exception ex)
            {
                return false;

            }
        }

        private static bool IsValidFileExtensionAndSignature(string fileName, Stream data, string[] permittedExtensions)
        {
            if (string.IsNullOrEmpty(fileName) || data == null || data.Length == 0)
            {
                return false;
            }

            var ext = Path.GetExtension(fileName).ToLowerInvariant();

            if (string.IsNullOrEmpty(ext) || !permittedExtensions.Contains(ext))
            {
                return false;
            }

            data.Position = 0;

            using (var reader = new BinaryReader(data))
            {
                if (ext.Equals(".txt") || ext.Equals(".csv") || ext.Equals(".prn"))
                {
                    if (_allowedChars.Length == 0)
                    {
                        // Limits characters to ASCII encoding.
                        for (var i = 0; i < data.Length; i++)
                        {
                            if (reader.ReadByte() > sbyte.MaxValue)
                            {
                                return false;
                            }
                        }
                    }
                    else
                    {
                        // Limits characters to ASCII encoding and
                        // values of the _allowedChars array.
                        for (var i = 0; i < data.Length; i++)
                        {
                            var b = reader.ReadByte();
                            if (b > sbyte.MaxValue ||
                                !_allowedChars.Contains(b))
                            {
                                return false;
                            }
                        }
                    }

                    return true;
                }


                var signatures = _fileSignature[ext];
                var headerBytes = reader.ReadBytes(signatures.Max(m => m.Length));

                return signatures.Any(signature =>
                    headerBytes.Take(signature.Length).SequenceEqual(signature));
            }
        }

    }
}
