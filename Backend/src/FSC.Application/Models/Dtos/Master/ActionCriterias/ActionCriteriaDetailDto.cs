namespace FSC.Application.Models.Dots.Master.ActionCriterias
{
    public class ActionCriteriaDetailDto
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public RecordStatus RecordStatus { get; set; }
    }
}
