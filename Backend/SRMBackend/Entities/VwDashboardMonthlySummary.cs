using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SRMBackend.Entities;

[Keyless]
public partial class VwDashboardMonthlySummary
{
    [Column("month")]
    public string? Month { get; set; }

    [Column("request_count")]
    public int? RequestCount { get; set; }
}
