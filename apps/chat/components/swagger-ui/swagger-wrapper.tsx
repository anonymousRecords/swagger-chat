import { useSwaggerStore } from '@/store/useSwaggerStore';
import dynamic from 'next/dynamic';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), {
  ssr: false,
  loading: () => <div>Loading Swagger UI...</div>
});

export const SwaggerWrapper = () => {
  const { url, file } = useSwaggerStore();

  const displayUrl = url || (file ? URL.createObjectURL(file) : null);

  if (!displayUrl) return null;

  return (
    <div className="swagger-wrapper p-4 bg-white overflow-auto h-full">
      <SwaggerUI url={displayUrl} />
    </div>
  );
};