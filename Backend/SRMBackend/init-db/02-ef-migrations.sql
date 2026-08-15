CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260813054632_InitSeedData') THEN
        IF NOT EXISTS(SELECT 1 FROM pg_namespace WHERE nspname = 'scholarship') THEN
            CREATE SCHEMA scholarship;
        END IF;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260813054632_InitSeedData') THEN
    INSERT INTO scholarship.members (id, created_at, email, first_name, is_active, last_name, password_hash, password_salt, updated_at, username)
    VALUES (1, TIMESTAMP '2026-01-01T00:00:00', 'admin@psu.ac.th', 'Admin', TRUE, 'Admin', '7903CC6982F0385E1000F276B60E109E6AA9D5AAE9A88E4444FA8C9FF5D59F60', 'FB0BB1412C716BE31CFDD0F7EACC7DE3', NULL, 'admin');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260813054632_InitSeedData') THEN
    PERFORM setval(
        pg_get_serial_sequence('scholarship.members', 'id'),
        GREATEST(
            (SELECT MAX(id) FROM scholarship.members) + 1,
            nextval(pg_get_serial_sequence('scholarship.members', 'id'))),
        false);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260813054632_InitSeedData') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260813054632_InitSeedData', '10.0.11');
    END IF;
END $EF$;
COMMIT;

