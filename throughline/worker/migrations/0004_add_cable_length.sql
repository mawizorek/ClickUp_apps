-- 0004: Add cable_length_ft to tie_lines for patch cable headroom calculations (300ft Cat6 limit)
ALTER TABLE tie_lines ADD COLUMN cable_length_ft INTEGER;
