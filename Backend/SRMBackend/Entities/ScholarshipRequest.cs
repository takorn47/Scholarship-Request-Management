using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SRMBackend.Entities;

[Table("scholarship_request", Schema = "scholarship")]
public partial class ScholarshipRequest
{
    [Key]
    [Column("request_id")]
    public int RequestId { get; set; }

    [Column("student_id")]
    [StringLength(13)]
    public string StudentId { get; set; } = null!;

    [Column("student_name")]
    [StringLength(100)]
    public string StudentName { get; set; } = null!;

    [Column("student_lname")]
    [StringLength(100)]
    public string StudentLname { get; set; } = null!;

    [Column("grade_level")]
    public int GradeLevel { get; set; }

    [Column("gpax")]
    [Precision(3, 2)]
    public decimal Gpax { get; set; }

    [Column("student_email")]
    [StringLength(100)]
    public string StudentEmail { get; set; } = null!;

    [Column("scholarship_type_id")]
    public int ScholarshipTypeId { get; set; }

    [Column("bank_account_number")]
    [StringLength(50)]
    public string BankAccountNumber { get; set; } = null!;

    [Column("request_reason")]
    public string? RequestReason { get; set; }

    [Column("fac_id")]
    [StringLength(2)]
    public string FacId { get; set; } = null!;

    [Column("dept_name")]
    [StringLength(50)]
    public string? DeptName { get; set; }

    [Column("pdpa_consent_version")]
    public int PdpaConsentVersion { get; set; }

    [Column("request_date", TypeName = "timestamp without time zone")]
    public DateTime RequestDate { get; set; }

    [Column("is_delete")]
    public bool IsDelete { get; set; }

    [Column("student_title_id")]
    public int StudentTitleId { get; set; }

    [Column("requested_amount")]
    [Precision(10, 2)]
    public decimal RequestedAmount { get; set; }

    [Column("scholarship_status_id")]
    public int ScholarshipStatusId { get; set; }

    [Column("delete_timestamp", TypeName = "timestamp without time zone")]
    public DateTime? DeleteTimestamp { get; set; }

    [ForeignKey("FacId")]
    [InverseProperty("ScholarshipRequest")]
    public virtual Faculty Fac { get; set; } = null!;

    [ForeignKey("PdpaConsentVersion")]
    [InverseProperty("ScholarshipRequest")]
    public virtual PdpaConsent PdpaConsentVersionNavigation { get; set; } = null!;

    [ForeignKey("ScholarshipStatusId")]
    [InverseProperty("ScholarshipRequest")]
    public virtual ScholarshipStatus ScholarshipStatus { get; set; } = null!;

    [ForeignKey("ScholarshipTypeId")]
    [InverseProperty("ScholarshipRequest")]
    public virtual ScholarshipTypes ScholarshipType { get; set; } = null!;

    [ForeignKey("StudentTitleId")]
    [InverseProperty("ScholarshipRequest")]
    public virtual Titlename StudentTitle { get; set; } = null!;
}
