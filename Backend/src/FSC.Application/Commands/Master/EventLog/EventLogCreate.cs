using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSC.Application.Commands
{
    public class EventLogCreate : IRequest<bool>
    {
        public string UserName { get; set; } = string.Empty;
        public string IpAddress { get; set; } = string.Empty;
        public string URL { get; set; } = string.Empty;
        public string Payload { get; set; } = string.Empty;
        public string StatusCode { get; set; } = string.Empty;
    }
    internal class EventLogHandler : IRequestHandler<EventLogCreate, bool>
    {
        private ApplicationDbContext _context;
        public EventLogHandler(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<bool> Handle(EventLogCreate request, CancellationToken cancellationToken)
        {
            try
            {
                var log = AuditEventLog.Add( request.IpAddress, request.URL, request.Payload, request.StatusCode, request.UserName);
                _context.AuditEventLogs.Add(log);
                _context.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }

}
