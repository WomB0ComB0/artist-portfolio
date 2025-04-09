import { Illustration } from '@/app/_component';
import { api } from '@/utils/api';
import { notFound } from 'next/navigation';

export default async function IllustrationPage({ params }: { params: { id: string } }) {
  try {
    const illustration = await api(`/api/illustrations/${params.id}`);

    return (
      <div className="container mx-auto px-8 py-8 flex justify-center items-center h-full">
        <Illustration {...illustration} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching illustration:', error);
    notFound();
  }
}
