using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SRMBackend.Entities;
using SRMBackend.IService;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace SRMBackend.Services
{
    public class AuthService : IAuthService
    {
        private IDbContextFactory<ScholarshipDbContext> _dbContextFactory = null!;
        private readonly IConfiguration _config;

        public AuthService(IDbContextFactory<ScholarshipDbContext> _dbContextFactory, IConfiguration _config)
        {
            this._dbContextFactory = _dbContextFactory;
            this._config = _config;
        }

        public async Task<Members?> GetMembersByIdAsync(string memberId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var user = await context.Members.FirstOrDefaultAsync(u => u.Id.ToString() == memberId && u.IsActive);
            return user;
        }

        public async Task<Members?> GetMembersAsync(string username)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var user = await context.Members.FirstOrDefaultAsync(u => u.Username == username && u.IsActive);
            return user;
        }

        public string GenerateToken(string userId, string username, string email, string role)
        {
            var jwtSettings = _config.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Set user claims included inside the payload
            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.Sub, userId),
            new Claim(ClaimTypes.Name, username),
            new Claim(JwtRegisteredClaimNames.Email, email),
            new Claim(ClaimTypes.Role, role),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2), // Set desired expiration
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public string GenerateCsrfToken()
        {
            return Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
        }

    }
}
