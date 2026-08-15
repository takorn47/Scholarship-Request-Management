namespace SRMBackend.DTOs
{
    public class UpdateRequestDTO
    {
        public string? StudentId { get; set; }
        public int? StudentTitleId { get; set; }
        public string? StudentName { get; set; }
        public string? StudentLname { get; set; }
        public int? GradeLevel { get; set; }
        public decimal? Gpax { get; set; }
        public string? StudentEmail { get; set; }
        public int? ScholarshipTypeId { get; set; }
        public decimal? RequestedAmount { get; set; }
        public string? BankAccountNumber { get; set; }
        public string? RequestReason { get; set; }
        public string? FacId { get; set; }
        public string? DeptName { get; set; }
        public int? PdpaConsentVersion { get; set; }
    }
}
