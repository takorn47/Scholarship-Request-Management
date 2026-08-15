using Microsoft.EntityFrameworkCore;
using SRMBackend.Entities;
using SRMBackend.IService;

namespace SRMBackend.Services
{
    public class LookupService : ILookupService
    {
        private IDbContextFactory<ScholarshipDbContext> _dbContextFactory = null!;

        public LookupService(IDbContextFactory<ScholarshipDbContext> _dbContextFactory = null!)
        {
            this._dbContextFactory = _dbContextFactory;
        }

        public async Task<List<Campus>> GetAllCampuses()
        {
            using var context = _dbContextFactory.CreateDbContext();
            return await context.Campus.Where(c => c.IsActive == true).OrderBy(c => c.CampusName).AsNoTracking().ToListAsync();
        }

        public async Task<List<Faculty>> GetAllFaculties()
        {
            using var context = _dbContextFactory.CreateDbContext();
            return await context.Faculty.Where(f => f.IsActive == true).OrderBy(f => f.FacNameTh).AsNoTracking().ToListAsync();
        }

        public async Task<List<Titlename>> GetAllTitles()
        {
            using var context = _dbContextFactory.CreateDbContext();
            return await context.Titlename.OrderBy(t => t.Titlename1).AsNoTracking().ToListAsync();
        }

        public async Task<List<ScholarshipTypes>> GetAllScholarshipTypes()
        {
            using var context = _dbContextFactory.CreateDbContext();
            return await context.ScholarshipTypes.Where(st => st.IsActive == true).OrderBy(st => st.SholarshipName).AsNoTracking().ToListAsync();
        }

        public async Task<List<PdpaConsent>> GetAllPdpaConsents()
        {
            using var context = _dbContextFactory.CreateDbContext();
            return await context.PdpaConsent.OrderByDescending(c => c.CreatedDate).AsNoTracking().ToListAsync();
        }

        public async Task<List<ScholarshipStatus>> GetAllScholarshipStatus()
        {
            using var context = _dbContextFactory.CreateDbContext();
            return await context.ScholarshipStatus.Where(c => c.IsActive).OrderBy(c => c.StatusId).AsNoTracking().ToListAsync();
        }
    }
}
