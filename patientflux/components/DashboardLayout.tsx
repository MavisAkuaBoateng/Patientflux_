import Link from 'next/link';
import { ReactNode } from 'react';

export default function DashboardLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="bg-white border-b">
        <div className="container py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-hospital-primary">{title}</h1>
          <nav className="flex gap-4 text-sm">
            <Link href="/checkin" className="text-gray-700 hover:text-hospital-primary">Check-In</Link>
            <Link href="/queue" className="text-gray-700 hover:text-hospital-primary">Queue</Link>
            <Link href="/doctor-dashboard" className="text-gray-700 hover:text-hospital-primary">Doctor</Link>
            <Link href="/admin-dashboard" className="text-gray-700 hover:text-hospital-primary">Admin</Link>
          </nav>
        </div>
      </header>
      <main className="container py-6">{children}</main>
    </div>
  );
}