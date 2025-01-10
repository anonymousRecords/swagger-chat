'use client';

import { SwaggerWrapper } from '@/components/swagger-ui/swagger-wrapper';

export const SwaggerPanel = () => {
  return (
    <div className="h-full overflow-y-auto">
      <SwaggerWrapper />
    </div>
  );
};
