import DeploymentDetailClient from './DeploymentDetailClient'

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
  ]
}

export default function DeploymentDetailPage({ params }: { params: { id: string } }) {
  return <DeploymentDetailClient deploymentId={params.id} />
}