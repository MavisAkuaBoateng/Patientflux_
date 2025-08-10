-- ========================
-- 1. Drop existing tables
-- ========================
DROP TABLE IF EXISTS ledger_logs CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ========================
-- 2. Create patients table
-- ========================
CREATE TABLE patients (
    id BIGSERIAL PRIMARY KEY,
    patient_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 0 AND age <= 150),
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    department VARCHAR(100) NOT NULL,
    visit_type VARCHAR(50) NOT NULL,
    symptoms TEXT NOT NULL,
    is_high_risk BOOLEAN DEFAULT FALSE,
    risk_factors TEXT[] DEFAULT '{}',
    priority VARCHAR(20) DEFAULT 'Normal' CHECK (priority IN ('Critical', 'High', 'Normal')),
    check_in_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'waiting' CHECK (status IN ('waiting', 'in-progress', 'completed', 'cancelled')),
    queue_position INTEGER DEFAULT 1,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================
-- 3. Create ledger_logs table with stronger FK
-- ========================
CREATE TABLE ledger_logs (
    id BIGSERIAL PRIMARY KEY,
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    patient_id VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    data JSONB,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMMITTED', 'FAILED')),
    block_number INTEGER,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Foreign key: match patient_id in patients
    CONSTRAINT fk_patient FOREIGN KEY (patient_id)
        REFERENCES patients(patient_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- ========================
-- 4. Create users table
-- ========================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'receptionist' CHECK (role IN ('admin', 'doctor', 'receptionist')),
    name VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================
-- 5. Indexes for performance
-- ========================
CREATE INDEX idx_patients_department ON patients(department);
CREATE INDEX idx_patients_status ON patients(status);
CREATE INDEX idx_patients_priority ON patients(priority);
CREATE INDEX idx_patients_check_in_time ON patients(check_in_time);
CREATE INDEX idx_ledger_logs_patient_id ON ledger_logs(patient_id);
CREATE INDEX idx_ledger_logs_status ON ledger_logs(status);
CREATE INDEX idx_users_role ON users(role);

-- ========================
-- 6. Updated_at function
-- ========================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ========================
-- 7. Triggers for updated_at
-- ========================
CREATE TRIGGER update_patients_updated_at
BEFORE UPDATE ON patients
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================
-- 8. Enable Row Level Security
-- ========================
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ========================
-- 9. RLS Policies
-- ========================
-- Patients
CREATE POLICY "Patients are viewable by authenticated users" ON patients
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Patients can be created by authenticated users" ON patients
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Patients can be updated by authenticated users" ON patients
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Ledger logs
CREATE POLICY "Ledger logs are viewable by authenticated users" ON ledger_logs
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Ledger logs can be created by authenticated users" ON ledger_logs
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users
CREATE POLICY "Users are viewable by authenticated users" ON users
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can be created by authenticated users" ON users
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ========================
-- 10. Seed Data
-- ========================
INSERT INTO patients (patient_id, name, age, gender, department, visit_type, symptoms, is_high_risk, risk_factors, priority)
VALUES
('KB-123456-ABC', 'Kwame Mensah', 45, 'Male', 'Cardiology', 'New Patient', 'Chest pain, shortness of breath', TRUE, ARRAY['Chronic Condition'], 'High'),
('KB-123457-DEF', 'Ama Osei', 28, 'Female', 'Gynecology', 'Follow-up', 'Pregnancy check-up', TRUE, ARRAY['Pregnant'], 'High'),
('KB-123458-GHI', 'John Doe', 35, 'Male', 'General Medicine', 'New Patient', 'Fever, cough', FALSE, ARRAY[]::TEXT[], 'Normal');

INSERT INTO ledger_logs (transaction_id, patient_id, action, data, status, block_number)
VALUES
('tx_001', 'KB-123456-ABC', 'PATIENT_CHECKIN', '{"name": "Kwame Mensah", "department": "Cardiology"}', 'COMMITTED', 12345),
('tx_002', 'KB-123457-DEF', 'PATIENT_CHECKIN', '{"name": "Ama Osei", "department": "Gynecology"}', 'COMMITTED', 12344),
('tx_003', 'KB-123458-GHI', 'PATIENT_CHECKIN', '{"name": "John Doe", "department": "General Medicine"}', 'COMMITTED', 12346);

INSERT INTO users (email, role, name, department) VALUES
('admin@korlebu.com', 'admin', 'System Administrator', NULL),
('doctor.smith@korlebu.com', 'doctor', 'Dr. Sarah Smith', 'Cardiology'),
('receptionist.jones@korlebu.com', 'receptionist', 'Mary Jones', 'General');
