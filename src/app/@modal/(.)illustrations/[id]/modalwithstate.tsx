'use client';

import { Modal } from '@/components';
import Image from 'next/image';
import Link from 'next/link';
import { useBoolean } from 'usehooks-ts';

export const ModalWithState = ({
  idNumber,
  MAX_ID,
  image,
}: { idNumber: number; MAX_ID: number; image: string }) => {
  const { value: isOpen, setTrue, setFalse } = useBoolean(true);

  const handleClose = () => {
    setFalse();
  };

  return (
    <>
      {isOpen && (
        <Modal isOpen={isOpen} onClose={handleClose}>
          <Link href={`/illustrations/${(idNumber - 1 + MAX_ID) % MAX_ID}`}>Previous</Link>
          <Image src={image} width={200} height={200} alt={`Illustration ${idNumber}`} />
          {idNumber}
          <Link href={`/illustrations/${(idNumber + 1) % MAX_ID}`}>Next</Link>
        </Modal>
      )}
    </>
  );
};
