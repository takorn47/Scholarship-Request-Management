using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SRMBackend.Entities;

[Table("scholarship_status", Schema = "scholarship")]
public partial class ScholarshipStatus
{
    [Key]
    [Column("status_id")]
    public int StatusId { get; set; }

    [Column("status_name")]
    [StringLength(100)]
    public string StatusName { get; set; } = null!;

    [Column("isActive")]
    public bool IsActive { get; set; }

    [InverseProperty("ScholarshipStatus")]
    public virtual ICollection<ScholarshipRequest> ScholarshipRequest { get; set; } = new List<ScholarshipRequest>();
}
