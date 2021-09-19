using Microsoft.EntityFrameworkCore.Migrations;

namespace TheBiscuitMachine.Infrastructure.Migrations
{
    public partial class AddColumnsToBiscuitPackages : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BiscuitsCount",
                table: "BiscuitPackages",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "PackageLabel",
                table: "BiscuitPackages",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BiscuitsCount",
                table: "BiscuitPackages");

            migrationBuilder.DropColumn(
                name: "PackageLabel",
                table: "BiscuitPackages");
        }
    }
}
