import { supabaseAdmin } from './supabaseAdmin';

export type LedgerPayload = {
  action: string;
  data: Record<string, any>;
};

export async function writeLedgerLog(patientId: string, payload: LedgerPayload) {
  // Placeholder for Hyperledger Fabric SDK integration (to be implemented later)
  // For MVP: log to console and persist to ledger_logs table
  console.log('[LedgerStub] Writing ledger entry', { patientId, payload });

  const { error } = await supabaseAdmin.from('ledger_logs').insert({
    patient_id: patientId,
    action: payload.action,
    payload: payload.data,
  });
  if (error) {
    console.error('Failed to persist ledger log:', error.message);
  }
}