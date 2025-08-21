-- Create HMS (Health Management System) Tables

-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create patients table
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    address TEXT,
    emergency_contact VARCHAR(255),
    medical_history TEXT,
    blood_type VARCHAR(5),
    allergies TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS public.doctors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    specialization VARCHAR(255) NOT NULL,
    license_number VARCHAR(255) UNIQUE NOT NULL,
    years_of_experience INTEGER DEFAULT 0,
    education TEXT,
    certifications TEXT,
    consultation_fee DECIMAL(10,2),
    available_days TEXT[], -- Array of days like ['monday', 'tuesday']
    available_hours JSONB, -- JSON object with time slots
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
    reason TEXT,
    notes TEXT,
    prescription TEXT,
    diagnosis TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create medical_records table
CREATE TABLE IF NOT EXISTS public.medical_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    record_type VARCHAR(50) NOT NULL, -- 'consultation', 'lab_result', 'prescription', etc.
    title VARCHAR(255) NOT NULL,
    description TEXT,
    attachments JSONB, -- Array of file URLs/paths
    vital_signs JSONB, -- Blood pressure, temperature, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error')),
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_patients_user_id ON public.patients(user_id);
CREATE INDEX IF NOT EXISTS idx_doctors_user_id ON public.doctors(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON public.appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_medical_records_patient_id ON public.medical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

-- Enable Row Level Security on all tables
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for patients table
CREATE POLICY "Users can view their own patient record" ON public.patients
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own patient record" ON public.patients
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own patient record" ON public.patients
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Doctors can view patient records for their appointments" ON public.patients
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.doctors d
            JOIN public.appointments a ON d.id = a.doctor_id
            WHERE d.user_id = auth.uid() AND a.patient_id = public.patients.id
        )
    );

-- RLS Policies for doctors table
CREATE POLICY "Users can view their own doctor record" ON public.doctors
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own doctor record" ON public.doctors
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own doctor record" ON public.doctors
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view doctor profiles" ON public.doctors
    FOR SELECT USING (true);

-- RLS Policies for appointments table
CREATE POLICY "Patients can view their own appointments" ON public.appointments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.patients p
            WHERE p.id = patient_id AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Doctors can view their own appointments" ON public.appointments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.doctors d
            WHERE d.id = doctor_id AND d.user_id = auth.uid()
        )
    );

CREATE POLICY "Patients can create appointments" ON public.appointments
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.patients p
            WHERE p.id = patient_id AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Doctors can update their appointments" ON public.appointments
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.doctors d
            WHERE d.id = doctor_id AND d.user_id = auth.uid()
        )
    );

-- RLS Policies for medical_records table
CREATE POLICY "Patients can view their own medical records" ON public.medical_records
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.patients p
            WHERE p.id = patient_id AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Doctors can view medical records for their patients" ON public.medical_records
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.doctors d
            WHERE d.id = doctor_id AND d.user_id = auth.uid()
        )
    );

CREATE POLICY "Doctors can create medical records" ON public.medical_records
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.doctors d
            WHERE d.id = doctor_id AND d.user_id = auth.uid()
        )
    );

-- RLS Policies for notifications table
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON public.patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON public.doctors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medical_records_updated_at BEFORE UPDATE ON public.medical_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data (optional)
-- You can uncomment these if you want sample data

/*
-- Sample specializations for doctors
INSERT INTO public.doctors (user_id, specialization, license_number, years_of_experience, education, consultation_fee, available_days, available_hours)
VALUES 
    -- You'll need to replace these user_ids with actual user IDs from your auth.users table
    ('00000000-0000-0000-0000-000000000000', 'Cardiologist', 'DOC001', 10, 'MD from University Medical School', 150.00, 
     ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], 
     '{"morning": ["09:00", "10:00", "11:00"], "afternoon": ["14:00", "15:00", "16:00"]}'),
    ('00000000-0000-0000-0000-000000000001', 'Pediatrician', 'DOC002', 8, 'MD Pediatrics from Children Hospital', 120.00,
     ARRAY['monday', 'wednesday', 'friday'], 
     '{"morning": ["08:00", "09:00", "10:00"], "afternoon": ["13:00", "14:00", "15:00"]}');
*/

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
