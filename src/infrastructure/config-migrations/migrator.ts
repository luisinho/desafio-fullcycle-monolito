import { join } from "path";
import { Sequelize } from "sequelize";
import { SequelizeStorage, Umzug } from "umzug";

export const migrator = ( sequelize: Sequelize) => {
  return new Umzug({
    migrations: {
      glob: [
        "dist/infrastructure/config-migrations/migrations/*.js",
        // src/infrastructure/config-migrations/migrations/*.{js,ts}",
        {
          cwd: process.cwd(), // Usa a raiz do projeto
          ignore: ["**/*.map", "**/*.d.ts", "**/index.js"],
          // cwd: join(__dirname, "../../../"),
          // ignore: ["**/*.d.ts", "**/index.ts", "**/index.js"],
        },
      ],
    },
    context: sequelize,
    storage: new SequelizeStorage({ sequelize }),
    logger: undefined,
  });
}