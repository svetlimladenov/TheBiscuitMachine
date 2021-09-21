using Microsoft.EntityFrameworkCore.Migrations;

namespace TheBiscuitMachine.Infrastructure.Migrations
{
    public partial class AddMachineConfigurations : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "OvenColdDurationTicks",
                table: "Machines",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<long>(
                name: "OvenHeatingDurationTicks",
                table: "Machines",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<long>(
                name: "OvenOverheatingDurationTicks",
                table: "Machines",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<int>(
                name: "Pulse",
                table: "Machines",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OvenColdDurationTicks",
                table: "Machines");

            migrationBuilder.DropColumn(
                name: "OvenHeatingDurationTicks",
                table: "Machines");

            migrationBuilder.DropColumn(
                name: "OvenOverheatingDurationTicks",
                table: "Machines");

            migrationBuilder.DropColumn(
                name: "Pulse",
                table: "Machines");
        }
    }
}
