Problem Statement 6: AI-Assisted OPD Scheduling and Patient Flow Management System
Outpatient flow is currently unstructured, leading to long wait times and missed cases.
Need: An AI-driven system that can:
Use QR/mobile check-ins for registration
Categorize patients (new, follow-up, post-op)
Prioritize vulnerable patients
Display real-time queues
Notify doctors about each patient’s category and position
Sync attendance logs to EMRs and research systems
Identify patterns in no-shows or high-risk patients


# PatientFlux - Hospital OPD Management Platform

A cloud-native hospital OPD scheduling and patient-flow management platform for Korle-Bu Teaching Hospital. Built with Next.js, Supabase, AI integration, and blockchain technology.

## 🏥 Features

### Core MVP Features

1. **QR/Mobile Check-In Form**
   - Comprehensive patient registration
   - Auto-generated patient IDs
   - QR code generation for patient tracking
   - Risk assessment and categorization

2. **Real-Time Queue Management**
   - Live-updating patient queue
   - Role-based views (Doctor/Receptionist)
   - Department and priority filtering
   - Queue position tracking

3. **AI-Powered Triage**
   - LiteLLM + Groq API integration
   - Symptom analysis and urgency assessment
   - Recommended next steps
   - Natural language queries for admin

4. **Blockchain Integration**
   - Hyperledger Fabric (mock for MVP)
   - Immutable patient records
   - Transaction logging
   - Secure data integrity

5. **Admin Analytics**
   - Hospital-wide analytics dashboard
   - Department performance metrics
   - Real-time statistics
   - Blockchain transaction monitoring

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TailwindCSS 4** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **Supabase** - PostgreSQL database + real-time subscriptions
- **WebSockets** - Live queue updates

### AI Integration
- **LiteLLM** - LLM orchestration
- **Groq API** - High-performance inference
- **Natural Language Processing** - Query understanding

### Blockchain
- **Hyperledger Fabric** - Enterprise blockchain (mock for MVP)
- **Transaction Logging** - Immutable records

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Groq API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd patientflux
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # LiteLLM Configuration
   LITELLM_API_KEY=your_litellm_api_key
   GROQ_API_KEY=your_groq_api_key

   # Application Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_HOSPITAL_NAME="Korle-Bu Teaching Hospital"
   ```

4. **Set up Supabase Database**
   - Create a new Supabase project
   - Run the SQL script in `supabase-setup.sql`
   - Enable real-time subscriptions for the `patients` table

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
patientflux/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── patients/      # Patient management
│   │   │   └── ai/           # AI endpoints
│   │   ├── checkin/          # Patient check-in page
│   │   ├── queue/            # Queue management
│   │   ├── doctor-dashboard/ # Doctor interface
│   │   └── admin-dashboard/  # Admin analytics
│   ├── components/           # Reusable UI components
│   └── lib/                  # Utility functions
│       ├── supabase.js       # Supabase configuration
│       ├── ai.js            # AI integration
│       ├── utils.js         # Helper functions
│       └── cn.js           # Class name utilities
├── public/                   # Static assets
├── supabase-setup.sql       # Database schema
└── package.json
```

## 🏥 Hospital Departments

The system includes 15 Korle-Bu Teaching Hospital departments:

- Accident & Emergency
- Cardiology
- Dermatology
- Endocrinology
- Gastroenterology
- General Medicine
- General Surgery
- Gynecology
- Neurology
- Oncology
- Ophthalmology
- Orthopedics
- Pediatrics
- Psychiatry
- Radiology

## 🤖 AI Features

### Triage Assessment
- Analyzes patient symptoms
- Provides urgency levels (Low/Medium/High/Critical)
- Recommends next steps
- Estimates wait times

### Natural Language Queries
- "Show today's high-risk patients"
- "Which department has the longest wait times?"
- "How many patients checked in this morning?"

## 🔗 API Endpoints

### Patient Management
- `GET /api/patients` - Get all patients with filters
- `POST /api/patients` - Create new patient
- `PUT /api/patients/[id]` - Update patient status

### AI Integration
- `POST /api/ai/triage` - Perform AI triage
- `POST /api/ai/query` - Process natural language queries

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm start
```

## 🔒 Security Features

- Row Level Security (RLS) in Supabase
- Environment variable protection
- Input validation and sanitization
- Role-based access control
- Blockchain transaction logging

## 📊 Analytics & Monitoring

- Real-time patient statistics
- Department performance metrics
- Wait time analytics
- Blockchain transaction monitoring
- AI query processing logs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- Real Hyperledger Fabric integration
- Mobile app development
- Advanced AI features
- Integration with hospital systems
- Multi-hospital support
- Advanced analytics and reporting

---

**Built with ❤️ for Korle-Bu Teaching Hospital**
