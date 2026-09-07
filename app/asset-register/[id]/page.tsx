import AssetDetailClient from './AssetDetailClient';

export async function generateStaticParams() {
  return Array.from({ length: 50 }, (_, i) => ({ id: String(i + 1) }));
}

export default function AssetDetailPage({ params }: { params: { id: string } }) {
  return <AssetDetailClient id={params.id} />;
}