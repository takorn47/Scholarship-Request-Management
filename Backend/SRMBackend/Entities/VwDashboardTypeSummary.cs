using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SRMBackend.Entities;

[Keyless]
public partial class VwDashboardTypeSummary
{
    [Column("sholarship_id")]
    public int? SholarshipId { get; set; }

    [Column("sholarship_name")]
    [StringLength(200)]
    public string? SholarshipName { get; set; }

    [Column("request_count")]
    public int? RequestCount { get; set; }

    [Column("total_requested_amount")]
    public decimal? TotalRequestedAmount { get; set; }
}
