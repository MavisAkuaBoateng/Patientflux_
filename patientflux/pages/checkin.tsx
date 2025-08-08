import DashboardLayout from '../components/DashboardLayout';
import CheckInForm from '../components/CheckInForm';

export default function CheckInPage() {
  return (
    <DashboardLayout title="Patient Check-In">
      <div className="max-w-3xl">
        <CheckInForm />
      </div>
    </DashboardLayout>
  );
}