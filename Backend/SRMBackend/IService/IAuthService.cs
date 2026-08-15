using SRMBackend.Entities;

namespace SRMBackend.IService
{
    public interface IAuthService
    {
        string GenerateToken(string userId, string username, string email, string role);
        Task<Members?> GetMembersAsync(string username);
        Task<Members?> GetMembersByIdAsync(string memberId);
    }
}