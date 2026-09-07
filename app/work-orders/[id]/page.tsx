import WODetailClient from './WODetailClient';

export async function generateStaticParams() {
  return Array.from({ length: 50 }, (_, i) => ({ id: String(i + 1) }));
}

export default function WorkOrderDetailPage({ params }: { params: { id: string } }) {
  return <WODetailClient workOrderId={params.id} />;
}