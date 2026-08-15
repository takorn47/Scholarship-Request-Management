using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace SRMBackend.Entities;

public partial class ScholarshipDbContext : DbContext
{
    public ScholarshipDbContext(DbContextOptions<ScholarshipDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Campus> Campus { get; set; }

    public virtual DbSet<Faculty> Faculty { get; set; }

    public virtual DbSet<Members> Members { get; set; }

    public virtual DbSet<PdpaConsent> PdpaConsent { get; set; }

    public virtual DbSet<ScholarshipRequest> ScholarshipRequest { get; set; }

    public virtual DbSet<ScholarshipRequestStatusLog> ScholarshipRequestStatusLog { get; set; }

    public virtual DbSet<ScholarshipStatus> ScholarshipStatus { get; set; }

    public virtual DbSet<ScholarshipTypes> ScholarshipTypes { get; set; }

    public virtual DbSet<Titlename> Titlename { get; set; }

    public virtual DbSet<VwDashboardMonthlySummary> VwDashboardMonthlySummary { get; set; }

    public virtual DbSet<VwDashboardStatusSummary> VwDashboardStatusSummary { get; set; }

    public virtual DbSet<VwDashboardTotals> VwDashboardTotals { get; set; }

    public virtual DbSet<VwDashboardTypeSummary> VwDashboardTypeSummary { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Campus>(entity =>
        {
            entity.HasKey(e => e.CampusId).HasName("campus_pkey");

            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<Faculty>(entity =>
        {
            entity.HasKey(e => e.FacId).HasName("faculty_pkey");

            entity.Property(e => e.IsActive).HasDefaultValue(true);

            entity.HasOne(d => d.Campus).WithMany(p => p.Faculty)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_campus_id");
        });

        modelBuilder.Entity<Members>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("members_pkey");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<PdpaConsent>(entity =>
        {
            entity.HasKey(e => e.VersionId).HasName("pdpa_consent_pkey");

            entity.Property(e => e.CreatedDate).HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        modelBuilder.Entity<ScholarshipRequest>(entity =>
        {
            entity.HasKey(e => e.RequestId).HasName("scholarship_request_pkey");

            entity.Property(e => e.RequestDate).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(d => d.Fac).WithMany(p => p.ScholarshipRequest)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_fac_id");

            entity.HasOne(d => d.PdpaConsentVersionNavigation).WithMany(p => p.ScholarshipRequest)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_pdpa_consent");

            entity.HasOne(d => d.ScholarshipStatus).WithMany(p => p.ScholarshipRequest)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("scholarship_request_scholarship_status_fk");

            entity.HasOne(d => d.ScholarshipType).WithMany(p => p.ScholarshipRequest)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_scholarshipe_type_id");

            entity.HasOne(d => d.StudentTitle).WithMany(p => p.ScholarshipRequest)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_title_id");
        });

        modelBuilder.Entity<ScholarshipRequestStatusLog>(entity =>
        {
            entity.HasKey(e => e.RequestLogId).HasName("scholarship_request_status_log_pk");

            entity.Property(e => e.ChangeDate).HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        modelBuilder.Entity<ScholarshipStatus>(entity =>
        {
            entity.HasKey(e => e.StatusId).HasName("scholarship_status_pkey");

            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<ScholarshipTypes>(entity =>
        {
            entity.HasKey(e => e.SholarshipId).HasName("scholarship_types_pkey");
        });

        modelBuilder.Entity<Titlename>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("titlename_pkey");
        });

        modelBuilder.Entity<VwDashboardMonthlySummary>(entity =>
        {
            entity.ToView("vw_dashboard_monthly_summary", "scholarship");
        });

        modelBuilder.Entity<VwDashboardStatusSummary>(entity =>
        {
            entity.ToView("vw_dashboard_status_summary", "scholarship");
        });

        modelBuilder.Entity<VwDashboardTotals>(entity =>
        {
            entity.ToView("vw_dashboard_totals", "scholarship");
        });

        modelBuilder.Entity<VwDashboardTypeSummary>(entity =>
        {
            entity.ToView("vw_dashboard_type_summary", "scholarship");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
