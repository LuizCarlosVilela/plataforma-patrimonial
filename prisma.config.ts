import { definePrismaConfig } from '@prisma/cli-engine';

export default definePrismaConfig({
  orm: {
    adapter: { provider: 'prisma-client-js' },
    family: { provider: 'postgresql' },
    target: { provider: 'prisma-client-js' }
  }
});
