using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SRMBackend.IService;

namespace SRMBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LookupController : ControllerBase
    {
        private ILookupService lookupService;
        public LookupController(ILookupService lookupService)
        {
            this.lookupService = lookupService;
        }

        [HttpGet("campus")]
        public async Task<IActionResult> GetAllCampuses()
        {
            var campuses = await lookupService.GetAllCampuses();
            return Ok(campuses);
        }

        [HttpGet("faculty")]
        public async Task<IActionResult> GetAllFaculties()
        {
            var faculties = await lookupService.GetAllFaculties();
            return Ok(faculties);
        }

        [HttpGet("title")]
        public async Task<IActionResult> GetAllTitles()
        {
            var titles = await lookupService.GetAllTitles();
            return Ok(titles);
        }

        [HttpGet("scholarshipTypes")]
        public async Task<IActionResult> GetAllScholarshipTypes()
        {
            var scholarshipTypes = await lookupService.GetAllScholarshipTypes();
            return Ok(scholarshipTypes);
        }

        [HttpGet("pdpaConsents")]
        public async Task<IActionResult> GetAllPDPAConsents()
        {
            var pdpaConsents = await lookupService.GetAllPdpaConsents();
            return Ok(pdpaConsents);
        }

        [HttpGet("scholarshipStatus")]
        public async Task<IActionResult> GetStatus()
        {
            var statuses = await lookupService.GetAllScholarshipStatus();
            return Ok(statuses);
        }
    }
}
