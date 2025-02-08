using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSC.Application.Models.Dots.Master.AircraftTypes
{
    public class AircraftTypeDetailDto
    {
        public long Id { get; set; }
        public string AircraftTypeCode { get; set; } = string.Empty;
        public string AircraftTypeName { get; set; } = string.Empty;
        public RecordStatus RecordStatus { get; set; }
    }
}
