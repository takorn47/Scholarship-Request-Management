using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace SRMBackend.Migrations
{
    /// <inheritdoc />
    public partial class InitSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "scholarship");

            migrationBuilder.InsertData(
                schema: "scholarship",
                table: "members",
                columns: new[] { "id", "created_at", "email", "first_name", "is_active", "last_name", "password_hash", "password_salt", "updated_at", "username" },
                values: new object[] { 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Local), "admin@psu.ac.th", "Admin", true, "Admin", "7903CC6982F0385E1000F276B60E109E6AA9D5AAE9A88E4444FA8C9FF5D59F60", "FB0BB1412C716BE31CFDD0F7EACC7DE3", null, "admin" });

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                schema: "scholarship",
                table: "members",
                keyColumns: new[] { "id" },
                keyValues: new object[] { 1 });
        }
    }
}
