namespace SRMBackend.DTOs
{
    public class PaginationFilterDTO
    {
        private int _pageSize = 10;
        private const int MaxPageSize = 50; // ป้องกัน Client ส่ง Request ขอข้อมูลเยอะเกินไป

        public int PageIndex { get; set; } = 1; // เริ่มต้นที่หน้า 1

        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }

        // (Option) เพิ่มคำค้นหา หรือ การจัดเรียงได้ตามต้องการ
        public string? SearchTerm { get; set; }
        public string? SortBy { get; set; }
        public bool IsDescending { get; set; } = false;
        public int? StatusId { get; set; }
        public int? ScholarshipTypeId { get; set; }
    }
}
