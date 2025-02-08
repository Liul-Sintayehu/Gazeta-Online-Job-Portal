using System.ComponentModel.DataAnnotations;

namespace FSC.Application.Models.Dots.Master.ActionCriterias
{
    public class ActionCriteriaDto
    {
        [Required(ErrorMessage = "Name is required.")]
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}
