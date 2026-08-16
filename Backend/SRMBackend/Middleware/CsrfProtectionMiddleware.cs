namespace SRMBackend.Middleware
{
    // Double-submit cookie CSRF check for cookie-authenticated requests.
    // Only engages when the "accessToken" cookie is present, so anonymous
    // public endpoints (which never receive a csrfToken cookie) are unaffected.
    public class CsrfProtectionMiddleware
    {
        private static readonly HashSet<string> ProtectedMethods = new(StringComparer.OrdinalIgnoreCase)
        {
            HttpMethods.Post, HttpMethods.Put, HttpMethods.Patch, HttpMethods.Delete
        };

        private readonly RequestDelegate _next;

        public CsrfProtectionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            if (ProtectedMethods.Contains(context.Request.Method) &&
                context.Request.Cookies.ContainsKey("accessToken"))
            {
                var cookieCsrf = context.Request.Cookies["csrfToken"];
                var headerCsrf = context.Request.Headers["X-CSRF-Token"].ToString();

                if (string.IsNullOrEmpty(cookieCsrf) || cookieCsrf != headerCsrf)
                {
                    context.Response.StatusCode = StatusCodes.Status403Forbidden;
                    await context.Response.WriteAsJsonAsync(new { message = "Invalid or missing CSRF token" });
                    return;
                }
            }

            await _next(context);
        }
    }
}
