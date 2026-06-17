Always inspect related files before generating code.

Never create new patterns when an existing pattern already exists.

Prefer modifying existing code over creating parallel implementations.

When implementing a feature:
1. Find similar feature.
2. Follow same architecture.
3. Reuse DTO patterns.
4. Reuse security patterns.
5. Reuse exception patterns.
6. Reuse mapper patterns.

Output production-ready code only.

## MCP Tools

This project has a PostgreSQL MCP server configured. Use it to:
- Explore database schema: `schema` - list columns, types, and keys for tables
- List tables: `list_tables` - show all tables with disk size
- Query data: `query` - execute read-only SELECT queries
- Get table structure: `schema` with table name filter