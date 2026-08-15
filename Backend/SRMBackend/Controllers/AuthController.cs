using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using SRMBackend.DTOs;
using SRMBackend.IService;
using System.Security.Claims;

namespace SRMBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private IAuthService authService;
        private ICryptoManger cryptoManger;

        public AuthController(IAuthService authService, ICryptoManger cryptoManger)
        {
            this.authService = authService;
            this.cryptoManger = cryptoManger;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO request)
        {

            var user = await authService.GetMembersAsync(request.Username);
            var isPass = cryptoManger.VerifyPassword(request.Password, user.PasswordHash, user.PasswordSalt);
            if (user == null || !isPass)
            {
                return Unauthorized(new { message = "Invalid username or password" });
            }


            // 2. Credentials valid -> Generate JWT
            var token = authService.GenerateToken(
                userId: user.Id.ToString(),
                username: user.Username,
                email: user.Email,
                role: "admin"
            );

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,                  // ป้องกัน JavaScript อ่าน Token (กัน XSS)
                Secure = true,                    // ส่งผ่าน HTTPS เท่านั้น (localhost ใช้ HTTPS ได้)
                SameSite = SameSiteMode.None,     // จำเป็นมาก หาก Frontend (เช่น React) และ Backend รันคนละ Port/Domain
                Expires = DateTimeOffset.UtcNow.AddMinutes(120) // ระยะเวลาหมดอายุ
            };

            Response.Cookies.Append("accessToken", token, cookieOptions);

            // 3. Return token to caller
            return Ok(new
            {
                token = token,
                expiresInMinutes = 120
            });
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> Profile()
        {
            // If MapInboundClaims = false in Program.cs:
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var user = await authService.GetMembersByIdAsync(userId);
            if (user == null)
            {
                return Unauthorized(new { message = "User not found" });
            }
            return Ok(new
            {
                id = user.Id,
                username = user.Username,
                email = user.Email,
                firstName = user.FirstName,
                lastName = user.LastName,
                isActive = user.IsActive,
                createdAt = user.CreatedAt,
                updatedAt = user.UpdatedAt
            });
        }
    }
}
