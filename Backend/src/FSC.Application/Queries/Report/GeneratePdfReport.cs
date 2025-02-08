using FSC.Domain.Models.Assignment;
using FSC.Domain.Models.Master;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace FSC.Application.Queries.Report;

public record GeneratePdfReportCommand(string BackgroundSealImagePath, long ClearanceAssignmentId) : IRequest<OperationResult<byte[]>>;

public class GeneratePdfReportWithUnicodeCheckboxesCommandHandler(
    IRepositoryBase<ClearanceAssignment> clearanceAssignmentRepo,
    IRepositoryBase<ClearanceSubTaskAssignment> clearanceSubTaskAssignmentRepo,
    IRepositoryBase<SubTask> subTaskRepo) 
    : IRequestHandler<GeneratePdfReportCommand, OperationResult<byte[]>>
{
    public async Task<OperationResult<byte[]>> Handle(GeneratePdfReportCommand request, CancellationToken cancellationToken)
    {
        QuestPDF.Settings.License = LicenseType.Community;
        
        var result = new OperationResult<byte[]>();

        var clearanceAssignment = await clearanceAssignmentRepo.Where(mf =>
                mf.Id == request.ClearanceAssignmentId
                && mf.RecordStatus != RecordStatus.Deleted)
            .Include(mf => mf.FlightSchedule)
            .Include(mf => mf.SecurityTeamLeader)
            .Include(mf => mf.ResponsiblePilot)
            .Include(mf => mf.PushOfficer)
            .Include(mf => mf.TeamLeaderApproval)
            .Include(mf => mf.PilotApproval)
            .FirstOrDefaultAsync(cancellationToken);
        if (clearanceAssignment is null)
        {
            result.AddError(ErrorCode.NotFound, "Clearance assignment not found!");
            return result; 
        }
        
        // var areAllSubTasksCompleted = await CheckIfAllSubTasksAreCompleted(request.ClearanceAssignmentId);
        // if (!areAllSubTasksCompleted)
        // {
        //     result.AddError(ErrorCode.ValidationError, "All subtasks must be completed first!");
        //     return result;
        // }

        var isApproved = clearanceAssignment is
        {
            TeamLeaderApproval.Action: ApprovalAction.Approved, 
            PilotApproval.Action: ApprovalAction.Approved
        };
        
        if (!isApproved)
        {
            result.AddError(ErrorCode.ValidationError, "Clearance must be approved by security team leader and responsible pilot!");
            return result;
        }
        
        
        // Validate the image path passed from the API layer
        if (!File.Exists(request.BackgroundSealImagePath))
        {
            result.AddError(ErrorCode.ServerError, "Seal image not found!");
            return result;
        }

        var checkLists = await subTaskRepo
            .Where(st => st.RecordStatus == RecordStatus.Active)
            .Select(st => st.Name) 
            .ToListAsync(cancellationToken);

        var document = CreateDocument(request.BackgroundSealImagePath, checkLists, clearanceAssignment);
        
        // Generate PDF as byte array
        var pdfBytes = document.GeneratePdf();
        result.Payload = pdfBytes;
        return result;
    }

    private async Task<bool> CheckIfAllSubTasksAreCompleted(long clearanceAssignmentId)
    {
        var subTasks = await subTaskRepo.Where(st => st.RecordStatus != RecordStatus.Deleted).ToListAsync();
        foreach (var subTask in subTasks)
        {
            var isSubTaskCompleted = await clearanceSubTaskAssignmentRepo.ExistWhereAsync(fa =>
                fa.SubTaskId == subTask.Id
                && fa.ClearanceAssignmentId == clearanceAssignmentId
                && fa.TaskStatus == WorkTaskStatus.Completed
                && fa.RecordStatus != RecordStatus.Deleted);
            
            if (isSubTaskCompleted) continue;

            return false;
        }

        return true;
    }

    protected virtual IDocument CreateDocument(string backgroundImagePath, List<string> checklists, ClearanceAssignment clearanceAssignment)
    {
        var date = clearanceAssignment.PilotApproval?.LastUpdateDate.ToShortDateString();
        var time = clearanceAssignment.PilotApproval?.LastUpdateDate.ToLongTimeString();
        var aircraftType = clearanceAssignment.FlightSchedule.AircraftType;
        var aircraftRegistrationNo = clearanceAssignment.FlightSchedule.AircraftRegistration;
        var departureStation = clearanceAssignment.FlightSchedule.LatestDeparture;
        var flightNo = $"{clearanceAssignment.FlightSchedule.Carrier}-{clearanceAssignment.FlightSchedule.FlightNumber}";

        if (!string.IsNullOrEmpty(clearanceAssignment.FlightSchedule.Suffix))
        {
            flightNo += $"-{clearanceAssignment.FlightSchedule.Suffix}";
        }

        var teamLeaderFullName = $"{clearanceAssignment.SecurityTeamLeader?.FirstName} {clearanceAssignment.SecurityTeamLeader?.MiddleName} {clearanceAssignment.SecurityTeamLeader?.LastName}";
        
        var pushOfficerFullName = clearanceAssignment.PushOfficer is not null ?
            $"{clearanceAssignment.PushOfficer.FirstName} {clearanceAssignment.PushOfficer.MiddleName} {clearanceAssignment.PushOfficer.LastName}"
            : "N/A";
        
        var responsiblePilotFullName = clearanceAssignment.ResponsiblePilot is not null ?
            $"{clearanceAssignment.ResponsiblePilot.FirstName} {clearanceAssignment.ResponsiblePilot.MiddleName} {clearanceAssignment.ResponsiblePilot.LastName}"
            : "N/A";
        
        return Document.Create(container =>
        {
            const string checkbox = "\u2705";

            container.Page(page =>
            {
                page.Margin(10);
                page.DefaultTextStyle(TextStyle.Default.FontSize(12).FontFamily(Fonts.SegoeUI));
                page.Size(PageSizes.A5);  

                // Page Seal
                page.Background().AlignMiddle()
                    .AlignCenter()
                    .Width(200)
                    .Height(200)
                    .Image(backgroundImagePath);
                page.Content()
                    .Border(0.5f)
                    .Padding(15)
                    .Column(column =>
                    {
                        column.Spacing(10);
                        column.Item().Text("Conformation of Preflight Security Check")
                            .Bold()
                            .FontSize(15)
                            .FontColor(Colors.Black)
                            .FontFamily(Fonts.Candara)
                            .Underline()
                            .AlignCenter();

                        column.Item().AlignRight().Row(innerRow =>
                        {
                            innerRow.AutoItem().Text($"Date: ");
                            innerRow.Spacing(10);
                            innerRow.AutoItem().Text(date).SemiBold().Underline();
                        });
                        column.Item().AlignRight().Row(innerRow =>
                        {
                            innerRow.AutoItem().Text("Time: ");
                            innerRow.Spacing(10);
                            innerRow.AutoItem().Text(time).SemiBold().Underline();
                        });

                        column.Item()
                            .Text(
                                "A per flight security check of the aircraft shall be done at the beginning of each operating day at the base and routine stations and when the aircraft is brought into service following maintenance or after a 'a night stop' in accordance with Pre flight security check list to discover unauthorized person weapon, dangerous devices or any other prohibited articles that may have been placed on board.")
                            .Justify()
                            .SemiBold();

                        column.Item().PaddingHorizontal(10).Row(row =>
                        {
                            row.RelativeItem().Column(c =>
                            {
                                c.Item().Row(innerRow =>
                                {
                                    innerRow.AutoItem().Text("A/C Type: ");
                                    innerRow.Spacing(10);
                                    innerRow.AutoItem().Text(aircraftType ?? "N/A").SemiBold().Underline();
                                });
                            });
                            row.AutoItem().Column(c =>
                            {
                                c.Item().Row(innerRow =>
                                {
                                    innerRow.AutoItem().Text("A/C No.: ");
                                    innerRow.Spacing(10);
                                    innerRow.AutoItem().Text(aircraftRegistrationNo ?? "N/A").SemiBold().Underline();
                                });
                            });
                        });

                        column.Item().PaddingHorizontal(10).Row(row =>
                        {
                            row.RelativeItem().Column(c =>
                            {
                                c.Item().Row(innerRow =>
                                {
                                    innerRow.AutoItem().Text($"Station: ");
                                    innerRow.Spacing(10);
                                    innerRow.AutoItem().Text(departureStation ?? "N/A").SemiBold().Underline();
                                });
                            });
                            row.AutoItem().Column(c =>
                            {
                                c.Item().Row(innerRow =>
                                {
                                    innerRow.AutoItem().Text($"Flight No.: ");
                                    innerRow.Spacing(10);
                                    innerRow.AutoItem().Text(flightNo).SemiBold().Underline();
                                });
                            });
                        });

                        column.Item()
                            .Text(
                                "It has been security checked in accordance with Federal Democratic Republic of Ethiopian National Civil Aviation Security Program (NCASP) and Pre-flight security Checklist requirement.")
                            .SemiBold().Justify();

                        column.Item().PaddingHorizontal(10).Column(col =>
                        {
                            col.Spacing(10);

                            // Define a row to accommodate both sections
                            col.Item().Row(row =>
                            {
                                row.RelativeItem().Column(c =>
                                {
                                    c.Spacing(2);

                                    c.Item().Text("Accomplished by:");
                                    c.Item().Text(pushOfficerFullName).SemiBold().Underline();
                                    c.Item().Text("Aviation Security Officer");
                                });

                                row.AutoItem().Column(c =>
                                {
                                    c.Spacing(2);

                                    c.Item().Text("Approved by:");
                                    c.Item().Text(teamLeaderFullName).SemiBold().Underline();
                                    c.Item().Text("Aviation Security Team Leader");
                                });
                            });
                        });

                        column.Item().Text(text =>
                        {
                            text.Justify();

                            text.Span("NOTE").Style(new TextStyle().Underline().Bold());

                            text.Span(
                                    ": This record shall be at the departure Airport for the duration of the flight or 24 hours, which and a copy shall be issued to the Pilot in Command and be kept on board the Aircraft duration of the flight for Audit purposes.")
                                .Style(new TextStyle().SemiBold());
                        });
                        
                        column.Item()
                            .Text(
                                "I have received a copy of the Security Conformation Checklist.")
                            .SemiBold().Justify();

                        column.Item().PaddingHorizontal(10).AlignRight().Column(col =>
                        {
                            col.Spacing(2);
                            col.Item().Row(innerRow =>
                            {
                                // innerRow.AutoItem().Text("Name: ");
                                // innerRow.Spacing(10);
                                innerRow.AutoItem().Text(responsiblePilotFullName).SemiBold().Underline();
                            });
                            col.Item().AlignRight().Text("Pilot in Command");
                        });
                        
                        
                        // Page Break
                        column.Item().PageBreak();

                        // Second Page
                        column.Item().Text("Pre-flight security checklist")
                            .Bold()
                            .FontSize(15)
                            .FontColor(Colors.Black)
                            .FontFamily(Fonts.Candara)
                            .Underline()
                            .AlignCenter();

                        column.Item().PaddingHorizontal(20).Column(col =>
                        {
                            col.Spacing(15);
                            foreach (var checklist in checklists)
                            {
                                col.Item().Row(row =>
                                {
                                    row.Spacing(10);

                                    row.AutoItem().Text(checkbox).FontSize(14);

                                    row.RelativeItem().Text(checklist).Justify().FontSize(14);
                                });
                            }
                        });
                    });
            });
        });
    }
}