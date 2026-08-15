using SRMBackend.DTOs;
using SRMBackend.Entities;

namespace SRMBackend.IService
{
    public interface IRequestService
    {
        Task<ScholarshipRequest> DeleteRequest(int requestId);
        Task<DashboardSummaryDTO> GetDashboardSummary();
        Task<List<ScholarshipRequest>> GetAllRequests();
        Task<PagedResultDTO<ScholarshipRequest>> GetAllRequests(PaginationFilterDTO filter);
        Task<ScholarshipRequest> GetRequestById(int requestId);
        Task<ScholarshipRequest> RequestScholarship(ScholarshipRequest request);
        Task<ScholarshipRequest> UpdateScholarshipRequest(int requestId, UpdateRequestDTO request);
        Task<bool> UpdateStatusOfRequest(int requestId, int newStatusId, string? remarks, string changeByAdminUsername);
    }
}