
using System.Collections.Generic;
using System.Text;

namespace FSC.Application.Models;

public class PagedResponse<T> : OperationResult<T>
{
    public int CurrentPageNumber { get; set; }
    public int CurrentPageSize { get; set; }
    public long TotalRecords { get; set; }

    public PagedResponse(T data, int pageNumber, int pageSize, long total)
    {
        this.CurrentPageNumber = pageNumber;
        this.CurrentPageSize = pageSize;
        this.Payload = data;
        this.Message = null;
        this.TotalRecords = total;
    }
}
