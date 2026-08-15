using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SRMBackend.DTOs;
using SRMBackend.Entities;
using SRMBackend.IService;
using System.Security.Claims;

namespace SRMBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScholarController : ControllerBase
    {
        private IRequestService requestService;
        private IMapper mapper;
        public ScholarController(IRequestService requestService, IMapper mapper)
        {
            this.requestService = requestService;
            this.mapper = mapper;
        }

        [HttpPost("request")]
        public async Task<IActionResult> CreateRequest([FromBody] RequestDTO request)
        {
            ScholarshipRequest scholarshipRequest = mapper.Map<ScholarshipRequest>(request);
            var createdRequest = await requestService.RequestScholarship(scholarshipRequest);
            return CreatedAtAction(nameof(CreateRequest), new { id = createdRequest.RequestId }, createdRequest);
        }

        [Authorize]
        [HttpPut("request/{id}")]
        public async Task<IActionResult> UpdateRequest(int id, [FromBody] UpdateRequestDTO request)
        {
            try
            {
                var updatedRequest = await requestService.UpdateScholarshipRequest(id, request);
                return Ok(updatedRequest);
            }
            catch (Exception)
            {
                return NoContent();
            }

        }

        [Authorize]
        [HttpDelete("request/{id}")]
        public async Task<IActionResult> DeleteRequest(int id)
        {
            try
            {
                var deletedRequest = await requestService.DeleteRequest(id);
                return Ok(deletedRequest);
            }
            catch (Exception)
            {

                return NoContent();
            }
        }

        [Authorize]
        [HttpGet("requests")]
        public async Task<IActionResult> GetAllRequests([FromQuery] PaginationFilterDTO filter)
        {
            var pagedRequests = await requestService.GetAllRequests(filter);
            return Ok(pagedRequests);
        }

        [Authorize]
        [HttpGet("summary")]
        public async Task<IActionResult> GetDashboardSummary()
        {
            var summary = await requestService.GetDashboardSummary();
            return Ok(summary);
        }

        [Authorize]
        [HttpPost("request/{requestId}/status")]
        public async Task<IActionResult> UpdateScholarStatus(int requestId, [FromBody] UpdateStatusDTO updateDTO)
        {
            try
            {
                var username = User.FindFirst(ClaimTypes.Name)?.Value ?? string.Empty;
                var isSuccess = await requestService.UpdateStatusOfRequest(requestId, updateDTO.StatusId, updateDTO.Remake, username);
                if (isSuccess)
                {
                    return Ok();
                }
                else
                {
                    return NoContent();
                }

            }
            catch (Exception)
            {

                throw;
            }

        }
    }
}
