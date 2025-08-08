**Follow these steps for any database schema change (add, modify, or remove columns/tables/relations):**

1. **Plan your change:**
   - Decide what you need to add, remove, or modify in the database (e.g., new table, column, relation, index).
   - Review the current `prisma/schema.prisma` and existing migration scripts for context.

2. **Create a migration script:**
   - In `database/migrations/base/`, create a new SQL file named with the next version and a clear description, e.g., `V1.15.0__add_new_table.sql`.
   - Write the SQL statements to apply your change (e.g., `ALTER TABLE`, `CREATE TABLE`, `DROP COLUMN`).
   - If you need to seed or update data, add those statements as well.
   - **Never edit old migration scripts.** Always add a new one.

3. **DO NOT MANUALLY UPDATE `prisma/schema.prisma`** for schema changes. Instead, use the following step to ensure you allow Prisma to update the schema by running their specific commands.

4. **Apply the migration locally:**
   - Run the migration against your local DB:
     ```zsh
     docker compose down -v
     docker volume prune -f
     docker compose up --build -d
     npx prisma db pull
     npx prisma generate
     ```
   - **Verify the DB structure is correct after migration.**

5. **Regenerate the Prisma client:**
   - After updating the schema, always run:
     ```zsh
     cd server
     npx prisma db pull
     npx prisma generate
     ```
   - This ensures your code uses the latest DB types and models.
   - NEVER MANUALLY UPDATE THE `prisma/schema.prisma` file. Always use the Prisma CLI commands to pull the latest schema from the database

6. **Update code and tests:**
   - Update services, controllers, mappers, and interfaces to use the new/changed DB fields.
   - Add or update tests to cover the new DB logic.
   - Update test data in `server/test-utils/test-data/` if needed.

7. **Validate everything:**
   - Run all tests: `npm run test`
   - Lint and format: `npm run lint --fix && npm run format`
   - Start the server: `npm run start`
   - Make sure there are no errors and all tests pass.
