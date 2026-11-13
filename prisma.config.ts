import { definePrismaConfig } from "prisma/config";

export default definePrismaConfig({
  orm: {
    target: "prisma/client",
    family: {
      id: "prisma-client-js",
      version: "7.10.1",
    },
    adapter: {
      id: "postgresql",
      version: "7.10.1",
      create: "import { PrismaPostgreSQL } from '@prisma/adapter-pg'; return new PrismaPostgreSQL();",
    },
  },
});
