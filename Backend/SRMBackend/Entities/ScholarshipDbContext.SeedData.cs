using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SRMBackend.IService;
using SRMBackend.Services;

namespace SRMBackend.Entities
{
    public partial class ScholarshipDbContext
    {
        private ICryptoManger? cryptoManger;

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder)
        {
            cryptoManger = new CryptoManger();
            //var hashed = cryptoManger.HashPassword("AdminPassword123!");

            var admin = new Members
            {
                Id = 1,
                Username = "admin",
                PasswordHash = "7903CC6982F0385E1000F276B60E109E6AA9D5AAE9A88E4444FA8C9FF5D59F60",
                PasswordSalt = "FB0BB1412C716BE31CFDD0F7EACC7DE3",
                FirstName = "Admin",
                LastName = "Admin",
                Email = "admin@psu.ac.th",
                IsActive = true,
                CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Local)
            };

            // Apply seed data
            modelBuilder.Entity<Members>().HasData(admin);
        }
    }
}
