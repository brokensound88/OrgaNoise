import { useEffect } from 'react';

export function useDynamicTitle(title: string) {
  useEffect(() => {
    const baseTitle = 'OrgaNoise';
    document.title = title ? `${title} | ${baseTitle}` : baseTitle;
  }, [title]);
}