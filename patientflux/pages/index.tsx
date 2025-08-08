import Link from 'next/link';

export default function Home() {
  return (
    <div className="container py-16">
      <h1 className="text-3xl md:text-4xl font-bold text-hospital-primary mb-6">PatientFlux</h1>
      <p className="text-gray-700 mb-8 max-w-2xl">Cloud-native OPD scheduling and patient-flow management for Korle-Bu Teaching Hospital.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/checkin" className="card p-6 hover:shadow-md transition"><h2 className="text-xl font-semibold">Check-In</h2><p className="text-gray-600">Register patient arrivals</p></Link>
        <Link href="/queue" className="card p-6 hover:shadow-md transition"><h2 className="text-xl font-semibold">Queue</h2><p className="text-gray-600">View live queue</p></Link>
        <Link href="/doctor-dashboard" className="card p-6 hover:shadow-md transition"><h2 className="text-xl font-semibold">Doctor</h2><p className="text-gray-600">Triage and manage patients</p></Link>
        <Link href="/admin-dashboard" className="card p-6 hover:shadow-md transition"><h2 className="text-xl font-semibold">Admin</h2><p className="text-gray-600">Analytics & queries</p></Link>
      </div>
    </div>
  );
}