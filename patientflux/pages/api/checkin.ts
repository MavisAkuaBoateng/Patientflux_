import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../lib/supabaseAdmin';
import { writeLedgerLog } from '../../lib/ledger';

function generatePatientId() {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  const ts = Date.now().toString().slice(-6);
  return `PF-${ts}-${rand}`;
}

function computeHighRisk(age: number, gender: string, visitType: string, symptoms: string, flag: boolean) {
  const s = symptoms.toLowerCase();
  const chronicKeywords = ['diabetes', 'hypertension', 'asthma', 'cancer', 'renal', 'kidney', 'cardiac', 'sickle', 'hiv'];
  const isElderly = age > 60;
  const isPregnant = gender.toLowerCase() === 'female' && /pregnan|gestation|trimester/.test(s);
  const isChronic = chronicKeywords.some((k) => s.includes(k));
  const isPostOp = visitType.toLowerCase() === 'post-op' || /post[- ]?op|postoperative/.test(s);
  return flag || isElderly || isPregnant || isChronic || isPostOp;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { name, age, gender, department, visitType, symptoms, highRiskFlag } = req.body || {};
  if (!name || age === undefined || !gender || !department || !visitType || !symptoms) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const patientId = generatePatientId();
  const highRisk = computeHighRisk(Number(age), String(gender), String(visitType), String(symptoms), !!highRiskFlag);
  const priorityTag = highRisk ? 'High-Risk' : 'Normal';

  const { data, error } = await supabaseAdmin.from('patients').insert({
    patient_id: patientId,
    name,
    age: Number(age),
    gender,
    department,
    visit_type: visitType,
    symptoms,
    high_risk: highRisk,
    priority_tag: priorityTag,
    status: 'waiting',
  }).select().single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  await writeLedgerLog(patientId, {
    action: 'PATIENT_CHECKIN',
    data: { patient_id: patientId, department, priority: priorityTag },
  });

  return res.status(200).json({ patient: data });
}