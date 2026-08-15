namespace SRMBackend.DTOs
{
    public class DashboardSummaryDTO
    {
        public int TotalRequests { get; set; }
        public decimal TotalRequestedAmount { get; set; }
        public decimal AverageRequestedAmount { get; set; }
        public List<StatusSummaryDTO> ByStatus { get; set; } = new();
        public List<TypeSummaryDTO> ByScholarshipType { get; set; } = new();
        public List<MonthSummaryDTO> ByMonth { get; set; } = new();
    }

    public class StatusSummaryDTO
    {
        public int? StatusId { get; set; }
        public string StatusName { get; set; } = null!;
        public int? Count { get; set; }
    }

    public class TypeSummaryDTO
    {
        public int? SholarshipId { get; set; }
        public string SholarshipName { get; set; } = null!;
        public int? Count { get; set; }
        public decimal? TotalRequestedAmount { get; set; }
    }

    public class MonthSummaryDTO
    {
        public string Month { get; set; } = null!;
        public int? Count { get; set; }
    }
}
