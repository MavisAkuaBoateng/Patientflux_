-- Seed additional test data for PatientFlux
-- Run this after the main supabase-setup.sql

-- Add more patients for testing pagination and queries
INSERT INTO patients (patient_id, name, age, gender, department, visit_type, symptoms, is_high_risk, risk_factors, priority, status) VALUES
-- Cardiology patients
('KB-123459-JKL', 'Sarah Johnson', 62, 'Female', 'Cardiology', 'Follow-up', 'Heart palpitations, chest discomfort', TRUE, ARRAY['Hypertension', 'Diabetes'], 'Critical', 'waiting'),
('KB-123460-MNO', 'Michael Chen', 45, 'Male', 'Cardiology', 'New Patient', 'Shortness of breath, fatigue', FALSE, ARRAY['Smoker'], 'High', 'waiting'),
('KB-123461-PQR', 'Emily Davis', 38, 'Female', 'Cardiology', 'Follow-up', 'Regular check-up', FALSE, ARRAY[], 'Normal', 'waiting'),

-- Pediatrics patients
('KB-123462-STU', 'Baby Emma Wilson', 2, 'Female', 'Pediatrics', 'New Patient', 'High fever, cough', TRUE, ARRAY['Young age'], 'High', 'waiting'),
('KB-123463-VWX', 'Tommy Brown', 8, 'Male', 'Pediatrics', 'Follow-up', 'Asthma check-up', FALSE, ARRAY['Asthma'], 'Normal', 'waiting'),
('KB-123464-YZA', 'Sophie Miller', 5, 'Female', 'Pediatrics', 'New Patient', 'Ear infection', FALSE, ARRAY[], 'Normal', 'waiting'),

-- Emergency Medicine patients
('KB-123465-BCD', 'Robert Taylor', 55, 'Male', 'Emergency Medicine', 'New Patient', 'Severe abdominal pain', TRUE, ARRAY['Previous surgery'], 'Critical', 'waiting'),
('KB-123466-EFG', 'Lisa Anderson', 29, 'Female', 'Emergency Medicine', 'New Patient', 'Broken arm from fall', FALSE, ARRAY[], 'High', 'waiting'),
('KB-123467-HIJ', 'David Wilson', 41, 'Male', 'Emergency Medicine', 'New Patient', 'Head injury from accident', TRUE, ARRAY['Head trauma'], 'Critical', 'waiting'),

-- General Medicine patients
('KB-123468-KLM', 'Jennifer Garcia', 33, 'Female', 'General Medicine', 'Follow-up', 'Diabetes management', FALSE, ARRAY['Diabetes'], 'Normal', 'waiting'),
('KB-123469-NOP', 'Christopher Lee', 27, 'Male', 'General Medicine', 'New Patient', 'Sore throat, fever', FALSE, ARRAY[], 'Normal', 'waiting'),
('KB-123470-QRS', 'Amanda White', 50, 'Female', 'General Medicine', 'Follow-up', 'Hypertension check', FALSE, ARRAY['Hypertension'], 'Normal', 'waiting'),

-- Surgery patients
('KB-123471-TUV', 'James Martinez', 48, 'Male', 'Surgery', 'New Patient', 'Appendicitis symptoms', TRUE, ARRAY['Severe pain'], 'Critical', 'waiting'),
('KB-123472-WXY', 'Maria Rodriguez', 35, 'Female', 'Surgery', 'Follow-up', 'Post-surgery check', FALSE, ARRAY['Recent surgery'], 'Normal', 'waiting'),
('KB-123473-ZAB', 'Daniel Thompson', 42, 'Male', 'Surgery', 'New Patient', 'Hernia symptoms', FALSE, ARRAY[], 'High', 'waiting'),

-- Neurology patients
('KB-123474-CDE', 'Patricia Moore', 67, 'Female', 'Neurology', 'New Patient', 'Severe headache, confusion', TRUE, ARRAY['Elderly', 'Neurological symptoms'], 'Critical', 'waiting'),
('KB-123475-FGH', 'Steven Jackson', 39, 'Male', 'Neurology', 'Follow-up', 'Epilepsy management', FALSE, ARRAY['Epilepsy'], 'Normal', 'waiting'),
('KB-123476-IJK', 'Nancy Martin', 58, 'Female', 'Neurology', 'New Patient', 'Tremors, balance issues', FALSE, ARRAY[], 'High', 'waiting'),

-- Gynecology patients
('KB-123477-LMN', 'Rebecca Clark', 31, 'Female', 'Gynecology', 'New Patient', 'Pregnancy complications', TRUE, ARRAY['Pregnant', 'High risk'], 'High', 'waiting'),
('KB-123478-OPQ', 'Jessica Lewis', 28, 'Female', 'Gynecology', 'Follow-up', 'Regular check-up', FALSE, ARRAY[], 'Normal', 'waiting'),
('KB-123479-RST', 'Ashley Hall', 36, 'Female', 'Gynecology', 'New Patient', 'Irregular periods', FALSE, ARRAY[], 'Normal', 'waiting'),

-- Orthopedics patients
('KB-123480-UVW', 'Kevin Young', 52, 'Male', 'Orthopedics', 'New Patient', 'Knee pain, difficulty walking', FALSE, ARRAY['Previous injury'], 'High', 'waiting'),
('KB-123481-XYZ', 'Michelle King', 44, 'Female', 'Orthopedics', 'Follow-up', 'Back pain management', FALSE, ARRAY['Chronic pain'], 'Normal', 'waiting'),
('KB-123482-ABC', 'Ryan Scott', 29, 'Male', 'Orthopedics', 'New Patient', 'Sports injury', FALSE, ARRAY[], 'Normal', 'waiting'),

-- Psychiatry patients
('KB-123483-DEF', 'Laura Green', 25, 'Female', 'Psychiatry', 'New Patient', 'Anxiety, depression', FALSE, ARRAY['Mental health'], 'Normal', 'waiting'),
('KB-123484-GHI', 'Mark Baker', 47, 'Male', 'Psychiatry', 'Follow-up', 'Medication review', FALSE, ARRAY['Mental health'], 'Normal', 'waiting'),
('KB-123485-JKL', 'Stephanie Adams', 33, 'Female', 'Psychiatry', 'New Patient', 'Stress management', FALSE, ARRAY[], 'Normal', 'waiting');

-- Add some patients with different statuses for testing
INSERT INTO patients (patient_id, name, age, gender, department, visit_type, symptoms, is_high_risk, risk_factors, priority, status) VALUES
('KB-123486-MNO', 'Thomas Nelson', 61, 'Male', 'Cardiology', 'New Patient', 'Chest pain', TRUE, ARRAY['Heart condition'], 'Critical', 'in-progress'),
('KB-123487-PQR', 'Catherine Carter', 39, 'Female', 'General Medicine', 'Follow-up', 'Diabetes check', FALSE, ARRAY['Diabetes'], 'Normal', 'completed'),
('KB-123488-STU', 'Andrew Mitchell', 53, 'Male', 'Emergency Medicine', 'New Patient', 'Severe bleeding', TRUE, ARRAY['Trauma'], 'Critical', 'in-progress'),
('KB-123489-VWX', 'Rachel Perez', 26, 'Female', 'Pediatrics', 'New Patient', 'Child with fever', FALSE, ARRAY[], 'High', 'completed'),
('KB-123490-YZA', 'Jonathan Roberts', 45, 'Male', 'Surgery', 'Follow-up', 'Post-operative care', FALSE, ARRAY['Recent surgery'], 'Normal', 'completed');
