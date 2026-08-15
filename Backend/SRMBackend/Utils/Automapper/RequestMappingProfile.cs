using AutoMapper;
using SRMBackend.DTOs;
using SRMBackend.Entities;

namespace SRMBackend.Utils.Automapper
{
    public class RequestMappingProfile : Profile
    {
        public RequestMappingProfile()
        {
            CreateMap<RequestDTO, ScholarshipRequest>();
        }

    }
}
