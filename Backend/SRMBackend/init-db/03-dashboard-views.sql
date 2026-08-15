CREATE OR REPLACE VIEW scholarship.vw_dashboard_totals AS
SELECT
    COUNT(*)::int AS total_requests,
    COALESCE(SUM(requested_amount), 0)::numeric AS total_requested_amount,
    COALESCE(AVG(requested_amount), 0)::numeric AS average_requested_amount
FROM scholarship.scholarship_request
WHERE is_delete = false;

CREATE OR REPLACE VIEW scholarship.vw_dashboard_status_summary AS
SELECT
    s.status_id,
    s.status_name,
    COUNT(r.request_id)::int AS request_count
FROM scholarship.scholarship_status s
LEFT JOIN scholarship.scholarship_request r
    ON r.scholarship_status_id = s.status_id AND r.is_delete = false
GROUP BY s.status_id, s.status_name;

CREATE OR REPLACE VIEW scholarship.vw_dashboard_type_summary AS
SELECT
    t.sholarship_id,
    t.sholarship_name,
    COUNT(r.request_id)::int AS request_count,
    COALESCE(SUM(r.requested_amount), 0)::numeric AS total_requested_amount
FROM scholarship.scholarship_types t
LEFT JOIN scholarship.scholarship_request r
    ON r.scholarship_type_id = t.sholarship_id AND r.is_delete = false
GROUP BY t.sholarship_id, t.sholarship_name;

CREATE OR REPLACE VIEW scholarship.vw_dashboard_monthly_summary AS
SELECT
    to_char(date_trunc('month', request_date), 'YYYY-MM') AS month,
    COUNT(*)::int AS request_count
FROM scholarship.scholarship_request
WHERE is_delete = false
GROUP BY date_trunc('month', request_date)
ORDER BY date_trunc('month', request_date);
