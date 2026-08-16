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
            if (user == null || !cryptoManger.VerifyPassword(request.Password, user.PasswordHash, user.PasswordSalt))
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
            var csrfToken = authService.GenerateCsrfToken();
            var expires = DateTimeOffset.UtcNow.AddMinutes(120);

            Response.Cookies.Append("accessToken", token, BuildCookieOptions(httpOnly: true, expires));
            Response.Cookies.Append("csrfToken", csrfToken, BuildCookieOptions(httpOnly: false, expires));

            // 3. Token is only ever delivered via cookies, never in the response body
            return Ok(new
            {
                expiresInMinutes = 120
            });
        }

        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            var expires = DateTimeOffset.UtcNow.AddMinutes(120);
            Response.Cookies.Delete("accessToken", BuildCookieOptions(httpOnly: true, expires));
            Response.Cookies.Delete("csrfToken", BuildCookieOptions(httpOnly: false, expires));
            return Ok();
        }

        // Cookie deletion must be called with the same Secure/SameSite/Path attributes
        // used at issuance, or the browser won't recognize it as the same cookie.
        private CookieOptions BuildCookieOptions(bool httpOnly, DateTimeOffset expires) => new()
        {
            HttpOnly = httpOnly,
            Secure = Request.IsHttps,
            SameSite = Request.IsHttps ? SameSiteMode.None : SameSiteMode.Lax,
            Expires = expires
        };

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
