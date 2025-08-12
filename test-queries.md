# PatientFlux Natural Language Query Tests

## Test Queries for Admin Dashboard

### Analytics Queries (Should work without LLM)
1. "What's the average wait time today?"
2. "Show me total patients"
3. "How many critical patients?"
4. "Waiting patients count"
5. "Department statistics"
6. "Average wait time in cardiology"

### Keyword-based Patient Queries (Should work without LLM)
1. "critical patients in cardiology"
2. "stable patients in pediatrics"
3. "all patients in cardiology"
4. "high risk patients"
5. "waiting patients in emergency medicine"
6. "patients in progress in surgery"

### Complex Queries (Should fall back to LLM)
1. "show me all critical patients in cardiology department"
2. "patients with chest pain symptoms"
3. "elderly patients over 65"
4. "patients who checked in this morning"

### Expected Results Format

#### For Analytics Queries:
```json
{
  "interpretation": "Average wait time analysis",
  "filters": { "analytics": "waitTime" },
  "resultType": "analytics",
  "data": {
    "avgWaitTime": "45 minutes",
    "totalPatients": 25,
    "waitingPatients": 15,
    "criticalPatients": 3,
    "highPriorityPatients": 8,
    "normalPatients": 14,
    "departmentStats": [
      {
        "department": "Cardiology",
        "total": 5,
        "waiting": 3,
        "avgWait": "52 minutes"
      }
    ]
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

#### For Patient List Queries:
```json
{
  "interpretation": "Critical patients in Cardiology",
  "filters": { 
    "department": "Cardiology", 
    "priority": "Critical" 
  },
  "resultType": "patientList",
  "data": [...],
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Doctor Dashboard Pagination Tests

### Row Numbering Verification
- Page 1 (10 rows): Should show 1-10
- Page 2 (10 rows): Should show 11-20
- Page 3 (10 rows): Should show 21-30

### Pagination Controls
- Previous/Next buttons
- Page indicator (Page X of Y)
- Rows per page selector (5, 10, 20, 50)
- Showing X to Y of Z patients

### Test Data Requirements
- At least 25 patients in the database
- Mix of different departments and priorities
- Various statuses (waiting, in-progress, completed)

## New Analytics Features

### Supported Analytics Queries:
- **Wait Time Analysis**: "average wait time", "avg wait time", "mean wait time"
- **Patient Counts**: "total patients", "how many patients", "patient count"
- **Priority Counts**: "critical patients", "critical count"
- **Status Counts**: "waiting patients", "patients waiting"
- **Department Stats**: "department stats", "department statistics", "by department"

### Analytics Calculations:
- Real-time average wait time calculation
- Priority breakdown (Critical, High, Normal)
- Department-wise statistics
- Waiting vs total patient counts
- Per-department average wait times
