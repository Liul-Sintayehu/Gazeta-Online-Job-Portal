// using System.Text.Json;
// using FSC.Application.Models.Dtos.IncidentHandling.TheftIncidents.Response;
// using FSC.Domain.Models.IncidentHandling.Incidents.TheftIncidents;
//
// namespace FSC.API.Contracts.Resolvers;
//
// public class ExhibitsResolver: IValueResolver<TheftIncident, TheftIncidentResponseDto, List<ExhibitItem>?>
// {
//
//     public List<ExhibitItem> Resolve(TheftIncident source, TheftIncidentResponseDto destination, List<ExhibitItem>? destMember, ResolutionContext context)
//     {
//         if (string.IsNullOrEmpty(source.ExhibitsSerialized))
//             return [];
//
//         var bags = JsonSerializer.Deserialize<List<ExhibitItem>>(source.ExhibitsSerialized);
//
//         // Use AutoMapper to map the BagIdentifier domain model to the response DTO
//         return context.Mapper.Map<List<ExhibitItem>>(bags);
//     }
// }