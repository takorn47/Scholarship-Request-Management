using SRMBackend.Entities;

namespace SRMBackend.IService
{
    public interface ILookupService
    {
        Task<List<Campus>> GetAllCampuses();
        Task<List<Faculty>> GetAllFaculties();
        Task<List<PdpaConsent>> GetAllPdpaConsents();
        Task<List<ScholarshipStatus>> GetAllScholarshipStatus();
        Task<List<ScholarshipTypes>> GetAllScholarshipTypes();
        Task<List<Titlename>> GetAllTitles();
    }
}