-- Update existing Input status values to match V2 schema
UPDATE inputs SET status = 'ACTIVE' WHERE status = 'NEW';
UPDATE inputs SET status = 'ACTIVE' WHERE status = 'DISCUSSING'; 
UPDATE inputs SET status = 'ACTIVE' WHERE status = 'ORGANIZED';
UPDATE inputs SET status = 'RESOLVED' WHERE status = 'IN_SOLUTION';
