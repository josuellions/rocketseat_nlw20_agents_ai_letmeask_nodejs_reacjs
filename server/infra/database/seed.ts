import { reset, seed } from "drizzle-seed";
import { database, sql } from "../database.ts";
import { schema } from "./schema/index.ts";

await reset(database, schema);

await seed(database, schema).refine((faker) => {
  return {
    rooms: {
      count: 20,
      columns: {
        name: faker.companyName(),
        description: faker.loremIpsum(),
      },
      with: {
        questions: 5,
      },
    },
  };
});

await sql.end();

// biome-ignore lint/suspicious/noConsole: only used in dev
console.log(">> DATABASE SEED");
