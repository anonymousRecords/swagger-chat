import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

interface SwaggerWrapperProps {
  url: string;
}

export default function SwaggerWrapper({ url }: SwaggerWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="p-4">Loading Swagger UI...</div>;
  }

  return (
    <div className="swagger-wrapper bg-white">
      <SwaggerUI url={url} />
    </div>
  );
}
