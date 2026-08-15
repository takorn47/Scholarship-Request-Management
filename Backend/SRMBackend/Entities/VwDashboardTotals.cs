using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SRMBackend.Entities;

[Keyless]
public partial class VwDashboardTotals
{
    [Column("total_requests")]
    public int? TotalRequests { get; set; }

    [Column("total_requested_amount")]
    public decimal? TotalRequestedAmount { get; set; }

    [Column("average_requested_amount")]
    public decimal? AverageRequestedAmount { get; set; }
}
