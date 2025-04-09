import { Button } from '@/components/ui/button';
import type React from 'react';

interface PaginationButtonProps {
  isActive: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export const PaginationButton: React.FC<PaginationButtonProps> = ({ isActive, onClick }) => {
  return <Button onClick={onClick} className={`pagination-button ${isActive ? 'active' : ''}`} />;
};
