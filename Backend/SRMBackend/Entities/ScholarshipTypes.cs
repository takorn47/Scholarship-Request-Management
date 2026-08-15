using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SRMBackend.Entities;

[Table("scholarship_types", Schema = "scholarship")]
public partial class ScholarshipTypes
{
    [Key]
    [Column("sholarship_id")]
    public int SholarshipId { get; set; }

    [Column("sholarship_name")]
    [StringLength(200)]
    public string SholarshipName { get; set; } = null!;

    [Column("isActive")]
    public bool IsActive { get; set; }

    [InverseProperty("ScholarshipType")]
    public virtual ICollection<ScholarshipRequest> ScholarshipRequest { get; set; } = new List<ScholarshipRequest>();
}
