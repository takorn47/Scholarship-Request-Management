using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SRMBackend.Entities;

[Table("faculty", Schema = "scholarship")]
public partial class Faculty
{
    [Key]
    [Column("fac_id")]
    [StringLength(2)]
    public string FacId { get; set; } = null!;

    [Column("fac_name_th")]
    [StringLength(100)]
    public string? FacNameTh { get; set; }

    [Column("campus_id")]
    [StringLength(2)]
    public string CampusId { get; set; } = null!;

    [Column("isActive")]
    public bool IsActive { get; set; }

    [ForeignKey("CampusId")]
    [InverseProperty("Faculty")]
    public virtual Campus Campus { get; set; } = null!;

    [InverseProperty("Fac")]
    public virtual ICollection<ScholarshipRequest> ScholarshipRequest { get; set; } = new List<ScholarshipRequest>();
}
