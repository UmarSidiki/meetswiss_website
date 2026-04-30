'use client';

import { useEffect, useRef } from 'react';

type TransferBookingFormEmbedProps = {
  embedHtml?: string;
};

export function TransferBookingFormEmbed({
  embedHtml,
}: TransferBookingFormEmbedProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const normalizedEmbed = embedHtml?.trim() || '';

  useEffect(() => {
    const mountNode = mountRef.current;

    if (!mountNode || !normalizedEmbed) {
      return;
    }

    mountNode.innerHTML = normalizedEmbed;

    const scripts = Array.from(mountNode.querySelectorAll('script'));
    scripts.forEach((scriptNode) => {
      const executableScript = document.createElement('script');

      Array.from(scriptNode.attributes).forEach((attribute) => {
        executableScript.setAttribute(attribute.name, attribute.value);
      });

      executableScript.text = scriptNode.text;
      scriptNode.parentNode?.replaceChild(executableScript, scriptNode);
    });

    return () => {
      mountNode.innerHTML = '';
    };
  }, [normalizedEmbed]);

  if (!normalizedEmbed) {
    return (
      <div className="rounded-2xl border border-primary/20 bg-lightblack/50 p-6 text-sm text-[#c8bfa8]">
        Add booking form embed HTML/script in Strapi for this destination.
      </div>
    );
  }

  return <div ref={mountRef} className="w-full" />;
}
