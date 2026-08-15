using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SRMBackend.Entities;

[Table("titlename", Schema = "scholarship")]
public partial class Titlename
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("titlename")]
    [StringLength(50)]
    public string Titlename1 { get; set; } = null!;

    [InverseProperty("StudentTitle")]
    public virtual ICollection<ScholarshipRequest> ScholarshipRequest { get; set; } = new List<ScholarshipRequest>();
}
