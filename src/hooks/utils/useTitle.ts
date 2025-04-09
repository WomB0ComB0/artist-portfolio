import { useState } from 'react';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';

const useTitle = (initialTitle: string) => {
  const [title, setTitle] = useState(initialTitle);

  useIsomorphicLayoutEffect(() => {
    const updateTitle = () => {
      const htmlTitle = document.querySelector('title') as HTMLTitleElement;

      htmlTitle.innerText = title;
    };

    updateTitle();
  }, [title]);

  return setTitle;
};

export default useTitle;
