using FSC.Domain.Helpers;

namespace FSC.Domain.Common
{
    public class BaseEntity
    {
        public long Id { get; private set; }

        //Auditlog
        public DateTime StartDate { get; private set; }
        public DateTime EndDate { get; private set; }
        public string TimeZoneInfo { get; private set; } = string.Empty;
        public DateTime RegisteredDate { get; private set; }
        public string RegisteredBy { get; private set; } = string.Empty;
        public DateTime LastUpdateDate { get; private set; }
        public string UpdatedBy { get; private set; } = string.Empty;
        public RecordStatus RecordStatus { get; private set; }
        public bool IsReadOnly { get; private set; }

        protected BaseEntity()
        {
            StartDate = Helper.GetDateTimeNow();
            EndDate = DateTime.MaxValue;
            RegisteredDate = Helper.GetDateTimeNow();
            LastUpdateDate = Helper.GetDateTimeNow();
            IsReadOnly = false;
            RecordStatus = RecordStatus.Active;
        }

        protected internal void UpdateAudit(string updatedBy = "")
        {
            LastUpdateDate = Helper.GetDateTimeNow();
            UpdatedBy = updatedBy;
        }
        public void UpdateRecordStatus(RecordStatus status, string updatedBy = "")
        {
            RecordStatus = status;
            LastUpdateDate = Helper.GetDateTimeNow();
            UpdatedBy = updatedBy;
        }

        protected void Register(string registeredBy = "")
        {
            RegisteredDate = Helper.GetDateTimeNow();
            StartDate = Helper.GetDateTimeNow();
            RegisteredBy = registeredBy;
        }

        protected void EndRecord(string updatedBy = "")
        {
            EndDate = Helper.GetDateTimeNow();
            LastUpdateDate = EndDate;
            UpdatedBy = updatedBy;
        }
        public void Delete(string deletedBy = "")
        {
            RecordStatus = RecordStatus.Deleted;
            LastUpdateDate = Helper.GetDateTimeNow();
            UpdatedBy = deletedBy;
        }
    }
}
