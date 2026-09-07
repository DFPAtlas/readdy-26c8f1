import ClientDetailClient from './ClientDetailClient'

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
  ]
}

export default function EnterpriseClientDetailPage({ params }: { params: { id: string } }) {
  return <ClientDetailClient clientId={params.id} />
}