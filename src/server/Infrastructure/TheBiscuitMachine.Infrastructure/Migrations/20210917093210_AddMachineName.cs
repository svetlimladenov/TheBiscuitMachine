using Microsoft.EntityFrameworkCore.Migrations;

namespace TheBiscuitMachine.Infrastructure.Migrations
{
    public partial class AddMachineName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Machines",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "Machines");
        }
    }
}
