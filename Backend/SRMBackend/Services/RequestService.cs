using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using SRMBackend.DTOs;
using SRMBackend.Entities;
using SRMBackend.IService;

namespace SRMBackend.Services
{
    public class RequestService : IRequestService
    {
        private IDbContextFactory<ScholarshipDbContext> _dbContextFactory = null!;
        public RequestService(IDbContextFactory<ScholarshipDbContext> _dbContextFactory)
        {
            this._dbContextFactory = _dbContextFactory;
        }

        public async Task<ScholarshipRequest> RequestScholarship(ScholarshipRequest request)
        {
            using var context = _dbContextFactory.CreateDbContext();
            request.ScholarshipStatusId = 1; // Set the initial status to "Pending"
            context.ScholarshipRequest.Add(request);
            await context.SaveChangesAsync();
            return request;
        }

        public async Task<ScholarshipRequest> UpdateScholarshipRequest(int requestId, UpdateRequestDTO request)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var existingRequest = await context.ScholarshipRequest.FindAsync(requestId);
            if (existingRequest == null)
            {
                throw new Exception($"Scholarship request with ID {requestId} not found.");
            }

            if (request.StudentId is not null) existingRequest.StudentId = request.StudentId;
            if (request.StudentTitleId is not null) existingRequest.StudentTitleId = request.StudentTitleId.Value;
            if (request.StudentName is not null) existingRequest.StudentName = request.StudentName;
            if (request.StudentLname is not null) existingRequest.StudentLname = request.StudentLname;
            if (request.GradeLevel is not null) existingRequest.GradeLevel = request.GradeLevel.Value;
            if (request.Gpax is not null) existingRequest.Gpax = request.Gpax.Value;
            if (request.StudentEmail is not null) existingRequest.StudentEmail = request.StudentEmail;
            if (request.ScholarshipTypeId is not null) existingRequest.ScholarshipTypeId = request.ScholarshipTypeId.Value;
            if (request.RequestedAmount is not null) existingRequest.RequestedAmount = request.RequestedAmount.Value;
            if (request.BankAccountNumber is not null) existingRequest.BankAccountNumber = request.BankAccountNumber;
            if (request.RequestReason is not null) existingRequest.RequestReason = request.RequestReason;
            if (request.FacId is not null) existingRequest.FacId = request.FacId;
            if (request.DeptName is not null) existingRequest.DeptName = request.DeptName;
            if (request.PdpaConsentVersion is not null) existingRequest.PdpaConsentVersion = request.PdpaConsentVersion.Value;

            await context.SaveChangesAsync();
            return existingRequest;
        }

        public async Task<ScholarshipRequest> DeleteRequest(int requestId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var request = await context.ScholarshipRequest.Where(r => r.RequestId == requestId).FirstOrDefaultAsync();
            if (request == null)
            {
                throw new Exception($"Scholarship request with ID {requestId} not found.");
            }
            request.IsDelete = true;
            request.DeleteTimestamp = DateTime.Now;
            await context.SaveChangesAsync();
            return request;
        }

        public async Task<ScholarshipRequest> GetRequestById(int requestId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var request = await context.ScholarshipRequest.Where(r => r.RequestId == requestId).AsNoTracking().FirstOrDefaultAsync();
            if (request == null)
            {
                throw new Exception($"Scholarship request with ID {requestId} not found.");
            }
            return request;
        }

        public async Task<List<ScholarshipRequest>> GetAllRequests()
        {
            using var context = _dbContextFactory.CreateDbContext();
            var requests = await context.ScholarshipRequest.AsNoTracking().ToListAsync();
            return requests;
        }

        public async Task<PagedResultDTO<ScholarshipRequest>> GetAllRequests(PaginationFilterDTO filter)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var query = context.ScholarshipRequest.Where(c => !c.IsDelete).AsNoTracking().AsQueryable();

            if (!string.IsNullOrEmpty(filter.SearchTerm))
            {
                query = query.Where(r => r.RequestId.ToString().Contains(filter.SearchTerm) || r.StudentName.Contains(filter.SearchTerm));
            }

            if (filter.StatusId.HasValue)
            {
                query = query.Where(r => r.ScholarshipStatusId == filter.StatusId.Value);
            }

            if (filter.ScholarshipTypeId.HasValue)
            {
                query = query.Where(r => r.ScholarshipTypeId == filter.ScholarshipTypeId.Value);
            }

            var totalCount = await query.CountAsync();
            var items = await query
                .Skip((filter.PageIndex - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            return new PagedResultDTO<ScholarshipRequest>
            {
                Items = items,
                TotalCount = totalCount,
                PageIndex = filter.PageIndex,
                PageSize = filter.PageSize
            };
        }

        public async Task<DashboardSummaryDTO> GetDashboardSummary()
        {
            using var context = _dbContextFactory.CreateDbContext();

            var totals = await context.VwDashboardTotals.AsNoTracking().FirstOrDefaultAsync();

            var byStatus = await context.VwDashboardStatusSummary
                .AsNoTracking()
                .Select(s => new StatusSummaryDTO
                {
                    StatusId = s.StatusId,
                    StatusName = s.StatusName,
                    Count = s.RequestCount
                })
                .ToListAsync();

            var byScholarshipType = await context.VwDashboardTypeSummary
                .AsNoTracking()
                .Select(t => new TypeSummaryDTO
                {
                    SholarshipId = t.SholarshipId,
                    SholarshipName = t.SholarshipName,
                    Count = t.RequestCount,
                    TotalRequestedAmount = t.TotalRequestedAmount
                })
                .ToListAsync();

            var byMonth = await context.VwDashboardMonthlySummary
                .AsNoTracking()
                .OrderByDescending(m => m.Month)
                .Take(12)
                .Select(m => new MonthSummaryDTO
                {
                    Month = m.Month,
                    Count = m.RequestCount
                })
                .ToListAsync();
            byMonth.Reverse();

            return new DashboardSummaryDTO
            {
                TotalRequests = totals?.TotalRequests ?? 0,
                TotalRequestedAmount = totals?.TotalRequestedAmount ?? 0,
                AverageRequestedAmount = totals?.AverageRequestedAmount ?? 0,
                ByStatus = byStatus,
                ByScholarshipType = byScholarshipType,
                ByMonth = byMonth
            };
        }

        public async Task<bool> UpdateStatusOfRequest(int requestId, int newStatusId, string? remarks, string changeByAdminUsername)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var request = await context.ScholarshipRequest
                .Include(r => r.ScholarshipStatus)
                .Where(r => r.RequestId == requestId).FirstOrDefaultAsync();

            var newStatus = await context.ScholarshipStatus.Where(c => c.StatusId == newStatusId).FirstOrDefaultAsync();
            if (request == null)
            {
                throw new Exception($"Scholarship request with ID {requestId} not found.");
            }
            // Update the status of the request
            context.ScholarshipRequestStatusLog.Add(new ScholarshipRequestStatusLog
            {
                RequestId = requestId,
                FromStatusId = request.ScholarshipStatusId,
                FromStatusName = request.ScholarshipStatus.StatusName,
                ToStatusId = newStatusId,
                ToStatusName = newStatus.StatusName,
                ChangeByAdminUsername = changeByAdminUsername,

                Remark = remarks,
                ChangeDate = DateTime.Now
            });

            request.ScholarshipStatusId = newStatus.StatusId;

            await context.SaveChangesAsync();
            return true;
        }

    }
}
