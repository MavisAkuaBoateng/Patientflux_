# PatientFlux Natural Language Query Tests

## Test Queries for Admin Dashboard

### Keyword-based Queries (Should work without LLM)
1. "critical patients in cardiology"
2. "stable patients in pediatrics"
3. "all patients in cardiology"
4. "high risk patients"
5. "waiting patients in emergency medicine"
6. "patients in progress in surgery"

### Complex Queries (Should fall back to LLM)
1. "show me all critical patients in cardiology department"
2. "what's the average wait time today?"
3. "patients with chest pain symptoms"
4. "elderly patients over 65"

### Expected Results Format
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
