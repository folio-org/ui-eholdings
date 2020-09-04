import { useState } from 'react';

const useModalToggle = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleModal = () => { setIsOpen(open => !open); };

  return { isOpen, toggleModal };
};

export default useModalToggle;
