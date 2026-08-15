using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SRMBackend.Entities;

[Keyless]
public partial class VwDashboardStatusSummary
{
    [Column("status_id")]
    public int? StatusId { get; set; }

    [Column("status_name")]
    [StringLength(100)]
    public string? StatusName { get; set; }

    [Column("request_count")]
    public int? RequestCount { get; set; }
}
