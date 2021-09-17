# Migrations

Run these from the current directory

Add new migrations

```bash
dotnet ef migrations add <MigrationName> --project TheBiscuitMachine.Infrastructure.csproj --startup-project ..\..\Web\TheBiscuitMachine.Web\TheBiscuitMachine.Web.csproj
```

Update the database

```bash
dotnet ef database update <MigrationName> --project TheBiscuitMachine.Infrastructure.csproj --startup-project ..\..\Web\TheBiscuitMachine.Web\TheBiscuitMachine.Web.csproj
```
