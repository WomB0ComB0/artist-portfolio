import { api } from '@/utils/api';
import { notFound } from 'next/navigation';
import { Modal } from './modal';

export default async function IllustrationModal({ params }: { params: { id: string } }) {
  try {
    const illustration = await api(`/api/illustrations/${params.id}`);
    return <Modal illustration={illustration} />;
  } catch (error) {
    console.error('Error fetching illustration for modal:', error);
    notFound();
  }
}
