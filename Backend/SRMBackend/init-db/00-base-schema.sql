--
-- PostgreSQL database dump
--

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: scholarship; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA scholarship;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: __EFMigrationsHistory; Type: TABLE; Schema: scholarship; Owner: -
--

CREATE TABLE scholarship."__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL
);


--
-- Name: campus; Type: TABLE; Schema: scholarship; Owner: -
--

CREATE TABLE scholarship.campus (
    campus_id character varying(2) NOT NULL,
    campus_name character varying(50) NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL
);


--
-- Name: faculty; Type: TABLE; Schema: scholarship; Owner: -
--

CREATE TABLE scholarship.faculty (
    fac_id character varying(2) NOT NULL,
    fac_name_th character varying(100),
    campus_id character varying(2) NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL
);


--
-- Name: members; Type: TABLE; Schema: scholarship; Owner: -
--

CREATE TABLE scholarship.members (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone,
    password_salt character varying(255) NOT NULL
);


--
-- Name: members_id_seq; Type: SEQUENCE; Schema: scholarship; Owner: -
--

CREATE SEQUENCE scholarship.members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: members_id_seq; Type: SEQUENCE OWNED BY; Schema: scholarship; Owner: -
--

ALTER SEQUENCE scholarship.members_id_seq OWNED BY scholarship.members.id;


--
-- Name: pdpa_consent; Type: TABLE; Schema: scholarship; Owner: -
--

CREATE TABLE scholarship.pdpa_consent (
    version_id integer NOT NULL,
    pdpa_text text NOT NULL,
    created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: pdpa_consent_version_id_seq; Type: SEQUENCE; Schema: scholarship; Owner: -
--

CREATE SEQUENCE scholarship.pdpa_consent_version_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pdpa_consent_version_id_seq; Type: SEQUENCE OWNED BY; Schema: scholarship; Owner: -
--

ALTER SEQUENCE scholarship.pdpa_consent_version_id_seq OWNED BY scholarship.pdpa_consent.version_id;


--
-- Name: scholarship_request; Type: TABLE; Schema: scholarship; Owner: -
--

CREATE TABLE scholarship.scholarship_request (
    request_id integer NOT NULL,
    student_id character varying(13) NOT NULL,
    student_name character varying(100) NOT NULL,
    student_lname character varying(100) NOT NULL,
    grade_level integer NOT NULL,
    gpax numeric(3,2) NOT NULL,
    student_email character varying(100) NOT NULL,
    scholarship_type_id integer NOT NULL,
    bank_account_number character varying(50) NOT NULL,
    request_reason text,
    fac_id character varying(2) NOT NULL,
    dept_name character varying(50),
    pdpa_consent_version integer NOT NULL,
    request_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_delete boolean DEFAULT false NOT NULL,
    student_title_id integer NOT NULL,
    requested_amount numeric(10,2) NOT NULL,
    scholarship_status_id integer CONSTRAINT scholarship_request_scholarship_status_not_null NOT NULL,
    delete_timestamp timestamp without time zone
);


--
-- Name: scholarship_request_request_id_seq; Type: SEQUENCE; Schema: scholarship; Owner: -
--

CREATE SEQUENCE scholarship.scholarship_request_request_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: scholarship_request_request_id_seq; Type: SEQUENCE OWNED BY; Schema: scholarship; Owner: -
--

ALTER SEQUENCE scholarship.scholarship_request_request_id_seq OWNED BY scholarship.scholarship_request.request_id;


--
-- Name: scholarship_request_status_log; Type: TABLE; Schema: scholarship; Owner: -
--

CREATE TABLE scholarship.scholarship_request_status_log (
    request_log_id integer NOT NULL,
    request_id integer NOT NULL,
    from_status_id integer NOT NULL,
    from_status_name character varying(50),
    to_status_id integer NOT NULL,
    to_status_name character varying(50),
    change_by_admin_username character varying(50) CONSTRAINT scholarship_request_status_lo_change_by_admin_username_not_null NOT NULL,
    remark text,
    change_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: scholarship_request_status_log_request_log_id_seq; Type: SEQUENCE; Schema: scholarship; Owner: -
--

CREATE SEQUENCE scholarship.scholarship_request_status_log_request_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: scholarship_request_status_log_request_log_id_seq; Type: SEQUENCE OWNED BY; Schema: scholarship; Owner: -
--

ALTER SEQUENCE scholarship.scholarship_request_status_log_request_log_id_seq OWNED BY scholarship.scholarship_request_status_log.request_log_id;


--
-- Name: scholarship_status; Type: TABLE; Schema: scholarship; Owner: -
--

CREATE TABLE scholarship.scholarship_status (
    status_id integer NOT NULL,
    status_name character varying(100) NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL
);


--
-- Name: scholarship_status_status_id_seq; Type: SEQUENCE; Schema: scholarship; Owner: -
--

CREATE SEQUENCE scholarship.scholarship_status_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: scholarship_status_status_id_seq; Type: SEQUENCE OWNED BY; Schema: scholarship; Owner: -
--

ALTER SEQUENCE scholarship.scholarship_status_status_id_seq OWNED BY scholarship.scholarship_status.status_id;


--
-- Name: scholarship_types; Type: TABLE; Schema: scholarship; Owner: -
--

CREATE TABLE scholarship.scholarship_types (
    sholarship_id integer NOT NULL,
    sholarship_name character varying(200) NOT NULL,
    "isActive" boolean NOT NULL
);


--
-- Name: scholarship_types_sholarship_id_seq; Type: SEQUENCE; Schema: scholarship; Owner: -
--

CREATE SEQUENCE scholarship.scholarship_types_sholarship_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: scholarship_types_sholarship_id_seq; Type: SEQUENCE OWNED BY; Schema: scholarship; Owner: -
--

ALTER SEQUENCE scholarship.scholarship_types_sholarship_id_seq OWNED BY scholarship.scholarship_types.sholarship_id;


--
-- Name: titlename; Type: TABLE; Schema: scholarship; Owner: -
--

CREATE TABLE scholarship.titlename (
    id integer NOT NULL,
    titlename character varying(50) NOT NULL
);


--
-- Name: titlename_id_seq; Type: SEQUENCE; Schema: scholarship; Owner: -
--

CREATE SEQUENCE scholarship.titlename_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: titlename_id_seq; Type: SEQUENCE OWNED BY; Schema: scholarship; Owner: -
--

ALTER SEQUENCE scholarship.titlename_id_seq OWNED BY scholarship.titlename.id;


--
-- Name: vw_dashboard_monthly_summary; Type: VIEW; Schema: scholarship; Owner: -
--

CREATE VIEW scholarship.vw_dashboard_monthly_summary AS
 SELECT to_char(date_trunc('month'::text, request_date), 'YYYY-MM'::text) AS month,
    (count(*))::integer AS request_count
   FROM scholarship.scholarship_request
  WHERE (is_delete = false)
  GROUP BY (date_trunc('month'::text, request_date))
  ORDER BY (date_trunc('month'::text, request_date));


--
-- Name: vw_dashboard_status_summary; Type: VIEW; Schema: scholarship; Owner: -
--

CREATE VIEW scholarship.vw_dashboard_status_summary AS
 SELECT s.status_id,
    s.status_name,
    (count(r.request_id))::integer AS request_count
   FROM (scholarship.scholarship_status s
     LEFT JOIN scholarship.scholarship_request r ON (((r.scholarship_status_id = s.status_id) AND (r.is_delete = false))))
  GROUP BY s.status_id, s.status_name;


--
-- Name: vw_dashboard_totals; Type: VIEW; Schema: scholarship; Owner: -
--

CREATE VIEW scholarship.vw_dashboard_totals AS
 SELECT (count(*))::integer AS total_requests,
    COALESCE(sum(requested_amount), (0)::numeric) AS total_requested_amount,
    COALESCE(avg(requested_amount), (0)::numeric) AS average_requested_amount
   FROM scholarship.scholarship_request
  WHERE (is_delete = false);


--
-- Name: vw_dashboard_type_summary; Type: VIEW; Schema: scholarship; Owner: -
--

CREATE VIEW scholarship.vw_dashboard_type_summary AS
 SELECT t.sholarship_id,
    t.sholarship_name,
    (count(r.request_id))::integer AS request_count,
    COALESCE(sum(r.requested_amount), (0)::numeric) AS total_requested_amount
   FROM (scholarship.scholarship_types t
     LEFT JOIN scholarship.scholarship_request r ON (((r.scholarship_type_id = t.sholarship_id) AND (r.is_delete = false))))
  GROUP BY t.sholarship_id, t.sholarship_name;


--
-- Name: members id; Type: DEFAULT; Schema: scholarship; Owner: -
--

ALTER TABLE ONLY scholarship.members ALTER COLUMN id SET DEFAULT nextval('scholarship.members_id_seq'::regclass);


--
-- Name: pdpa_consent version_id; Type: DEFAULT; Schema: scholarship; Owner: -
--

ALTER TABLE ONLY scholarship.pdpa_consent ALTER COLUMN version_id SET DEFAULT nextval('scholarship.pdpa_consent_version_id_seq'::regclass);


--
-- Name: scholarship_request request_id; Type: DEFAULT; Schema: scholarship; Owner: -
--

ALTER TABLE ONLY scholarship.scholarship_request ALTER COLUMN request_id SET DEFAULT nextval('scholarship.scholarship_request_request_id_seq'::regclass);


--
-- Name: scholarship_request_status_log request_log_id; Type: DEFAULT; Schema: scholarship; Owner: -
--

ALTER TABLE ONLY scholarship.scholarship_request_status_log ALTER COLUMN request_log_id SET DEFAULT nextval('scholarship.scholarship_request_status_log_request_log_id_seq'::regclass);


--
-- Name: scholarship_status status_id; Type: DEFAULT; Schema: scholarship; Owner: -
--

ALTER TABLE ONLY scholarship.scholarship_status ALTER COLUMN status_id SET DEFAULT nextval('scholarship.scholarship_status_status_id_seq'::regclass);


--
-- Name: scholarship_types sholarship_id; Type: DEFAULT; Schema: scholarship; Owner: -
--

ALTER TABLE ONLY scholarship.scholarship_types ALTER COLUMN sholarship_id SET DEFAULT nextval('scholarship.scholarship_types_sholarship_id_seq'::regclass);


--
-- Name: titlename id; Type: DEFAULT; Schema: scholarship; Owner: -
--

ALTER TABLE ONLY scholarship.titlename ALTER COLUMN id SET DEFAULT nextval('scholarship.titlename_id_seq'::regclass);


--
-- Name: __EFMigrationsHistory PK___EFMigrationsHistory; Type: CONSTRAINT; Schema: scholarship; Owner: -
--

ALTER TABLE ONLY scholarship."__EFMigrationsHistory"
    ADD CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId");


--
-- Name: campus campus_pkey; Type: CONSTRAINT; Schema: scholarship; Owner: -
--

ALTER TABLE ONLY scholarship.campus
    ADD CONSTRAINT campus_pkey PRIMARY KEY (campus_id);


--
-- Name: faculty faculty_pkey; Type: CONSTRAINT; Schema: scholarship; Owner: -
--

ALTER TABLE ONLY scholarship.faculty
    ADD CONSTRAINT faculty_pkey PRIMARY KEY (fac_id);


--
-- Name: members members_email_key; Type: CONSTRAINT; Schema: scholarship; Owner: -
--

ALTER TABLE ONLY scholarship.members
    ADD CONSTRAINT members_email_key UNIQUE (email);


--
-- Name: members members_pkey; Type: CONSTRAINT; Schema: scholarship; Owner: -
--

ALTER TABLE ONLY scholarship.members
    ADD CONSTRAINT members_pkey PRIMARY KEY (id);


--
-- Name: members members_username_key; Type: CONSTRAINT; Schema: scholarship; Owner: -
--

ALTER TABLE ONLY scholarship.members
    ADD CONSTRAINT members_username_key UNIQUE (username);


--
-- Name: pdpa_consent pdpa_consent_pkey; Type: CONSTRAINT; Schema: scholarship; Owner: -
--

ALTER TABLE ONLY scholarship.pdpa_consent
    ADD CONSTRAINT pdpa_consent_pkey PRIMARY KEY (version_id);


--
-- Name: scholarship_request scholarship_request_pkey; Type: CONSTRAINT; Schema: scholarship; Owner: -
--

ALTER TABLE ONLY scholarship.scholarship_request
    ADD CONSTRAINT scholarship_request_pkey PRIMARY KEY (request_id);


--
-- Name: scholarship_request_status_log scholarship_request_status_log_pk; Type: CONSTRAINT; Schema: scholarship; Owner: -
--

ALTER TABLE ONLY scholarship.scholarship_request_status_log
    ADD CONSTRAINT scholarship_request_status_log_pk PRIMARY KEY (request_log_id);


--
-- Name: scholarship_status scholarship_status_pkey; Type: CONSTRAINT; Schema: scholarship; Owner: -
--

ALTER TABLE ONLY scholarship.scholarship_status
    ADD CONSTRAINT scholarship_status_pkey PRIMARY KEY (status_id);


--
-- Name: scholarship_types scholarship_types_pkey; Type: CONSTRAINT; Schema: scholarship; Owner: -
--

ALTER TABLE ONLY scholarship.scholarship_types
    ADD CONSTRAINT scholarship_types_pkey PRIMARY KEY (sholarship_id);


--
-- Name: titlename titlename_pkey; Type: CONSTRAINT; Schema: scholarship; Owner: -
--

ALTER TABLE ONLY scholarship.titlename
    ADD CONSTRAINT titlename_pkey PRIMARY KEY (id);


--
-- Name: faculty fk_campus_id; Type: FK CONSTRAINT; Schema: scholarship; Owner: -
--

ALTER TABLE ONLY scholarship.faculty
    ADD CONSTRAINT fk_campus_id FOREIGN KEY (campus_id) REFERENCES scholarship.campus(campus_id) NOT VALID;


--
-- Name: scholarship_request fk_fac_id; Type: FK CONSTRAINT; Schema: scholarship; Owner: -
--

ALTER TABLE ONLY scholarship.scholarship_request
    ADD CONSTRAINT fk_fac_id FOREIGN KEY (fac_id) REFERENCES scholarship.faculty(fac_id) NOT VALID;


--
-- Name: scholarship_request fk_pdpa_consent; Type: FK CONSTRAINT; Schema: scholarship; Owner: -
--

ALTER TABLE ONLY scholarship.scholarship_request
    ADD CONSTRAINT fk_pdpa_consent FOREIGN KEY (pdpa_consent_version) REFERENCES scholarship.pdpa_consent(version_id) NOT VALID;


--
-- Name: scholarship_request fk_scholarshipe_type_id; Type: FK CONSTRAINT; Schema: scholarship; Owner: -
--

ALTER TABLE ONLY scholarship.scholarship_request
    ADD CONSTRAINT fk_scholarshipe_type_id FOREIGN KEY (scholarship_type_id) REFERENCES scholarship.scholarship_types(sholarship_id);


--
-- Name: scholarship_request fk_title_id; Type: FK CONSTRAINT; Schema: scholarship; Owner: -
--

ALTER TABLE ONLY scholarship.scholarship_request
    ADD CONSTRAINT fk_title_id FOREIGN KEY (student_title_id) REFERENCES scholarship.titlename(id) NOT VALID;


--
-- Name: scholarship_request scholarship_request_scholarship_status_fk; Type: FK CONSTRAINT; Schema: scholarship; Owner: -
--

ALTER TABLE ONLY scholarship.scholarship_request
    ADD CONSTRAINT scholarship_request_scholarship_status_fk FOREIGN KEY (scholarship_status_id) REFERENCES scholarship.scholarship_status(status_id);


--
-- PostgreSQL database dump complete
--

