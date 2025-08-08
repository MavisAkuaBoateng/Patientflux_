import DashboardLayout from '../components/DashboardLayout';
import QueueList from '../components/QueueList';

export default function QueuePage() {
  return (
    <DashboardLayout title="OPD Queue">
      <QueueList />
    </DashboardLayout>
  );
}