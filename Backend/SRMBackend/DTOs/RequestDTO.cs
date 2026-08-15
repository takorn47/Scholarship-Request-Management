namespace SRMBackend.DTOs
{
    public class RequestDTO
    {
        public string StudentId { get; set; } = null!;
        public int StudentTitleId { get; set; }
        public string StudentName { get; set; } = null!;
        public string StudentLname { get; set; } = null!;
        public int GradeLevel { get; set; }
        public decimal Gpax { get; set; }
        public string StudentEmail { get; set; } = null!;
        public int ScholarshipTypeId { get; set; }
        public int ScholarshipStatusId { get; set; }
        public decimal RequestedAmount { get; set; }
        public string BankAccountNumber { get; set; } = null!;
        public string? RequestReason { get; set; }
        public string FacId { get; set; } = null!;
        public string? DeptName { get; set; }
        public int PdpaConsentVersion { get; set; }
    }
}
