using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SRMBackend.Entities;

[Table("campus", Schema = "scholarship")]
public partial class Campus
{
    [Key]
    [Column("campus_id")]
    [StringLength(2)]
    public string CampusId { get; set; } = null!;

    [Column("campus_name")]
    [StringLength(50)]
    public string CampusName { get; set; } = null!;

    [Column("isActive")]
    public bool IsActive { get; set; }

    [InverseProperty("Campus")]
    public virtual ICollection<Faculty> Faculty { get; set; } = new List<Faculty>();
}
