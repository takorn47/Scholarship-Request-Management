using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SRMBackend.Entities;

[Table("pdpa_consent", Schema = "scholarship")]
public partial class PdpaConsent
{
    [Key]
    [Column("version_id")]
    public int VersionId { get; set; }

    [Column("pdpa_text")]
    public string PdpaText { get; set; } = null!;

    [Column("created_date", TypeName = "timestamp without time zone")]
    public DateTime CreatedDate { get; set; }

    [InverseProperty("PdpaConsentVersionNavigation")]
    public virtual ICollection<ScholarshipRequest> ScholarshipRequest { get; set; } = new List<ScholarshipRequest>();
}
