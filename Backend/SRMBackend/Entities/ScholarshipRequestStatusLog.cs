using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SRMBackend.Entities;

[Table("scholarship_request_status_log", Schema = "scholarship")]
public partial class ScholarshipRequestStatusLog
{
    [Key]
    [Column("request_log_id")]
    public int RequestLogId { get; set; }

    [Column("request_id")]
    public int RequestId { get; set; }

    [Column("from_status_id")]
    public int FromStatusId { get; set; }

    [Column("from_status_name")]
    [StringLength(50)]
    public string? FromStatusName { get; set; }

    [Column("to_status_id")]
    public int ToStatusId { get; set; }

    [Column("to_status_name")]
    [StringLength(50)]
    public string? ToStatusName { get; set; }

    [Column("change_by_admin_username")]
    [StringLength(50)]
    public string ChangeByAdminUsername { get; set; } = null!;

    [Column("remark")]
    public string? Remark { get; set; }

    [Column("change_date", TypeName = "timestamp without time zone")]
    public DateTime ChangeDate { get; set; }
}
