﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using TheBiscuitMachine.Infrastructure;

namespace TheBiscuitMachine.Infrastructure.Migrations
{
    [DbContext(typeof(TheBiscuitMachineContext))]
    [Migration("20210919160911_AddMachineReports")]
    partial class AddMachineReports
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("ProductVersion", "5.0.9")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("TheBiscuitMachine.Data.Models.BiscuitPackage", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("BiscuitPackages");
                });

            modelBuilder.Entity("TheBiscuitMachine.Data.Models.Machine", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("UserId")
                        .IsUnique()
                        .HasFilter("[UserId] IS NOT NULL");

                    b.ToTable("Machines");
                });

            modelBuilder.Entity("TheBiscuitMachine.Data.Models.MachineReport", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Event")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("MachineId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<DateTime>("TimeStamp")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("MachineId");

                    b.ToTable("MachineReports");
                });

            modelBuilder.Entity("TheBiscuitMachine.Data.Models.User", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Email")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("MachineId")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Username")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("TheBiscuitMachine.Data.Models.BiscuitPackage", b =>
                {
                    b.HasOne("TheBiscuitMachine.Data.Models.User", "User")
                        .WithMany("BiscuitPackages")
                        .HasForeignKey("UserId");

                    b.Navigation("User");
                });

            modelBuilder.Entity("TheBiscuitMachine.Data.Models.Machine", b =>
                {
                    b.HasOne("TheBiscuitMachine.Data.Models.User", "User")
                        .WithOne("Machine")
                        .HasForeignKey("TheBiscuitMachine.Data.Models.Machine", "UserId");

                    b.Navigation("User");
                });

            modelBuilder.Entity("TheBiscuitMachine.Data.Models.MachineReport", b =>
                {
                    b.HasOne("TheBiscuitMachine.Data.Models.Machine", "Machine")
                        .WithMany("Reports")
                        .HasForeignKey("MachineId");

                    b.Navigation("Machine");
                });

            modelBuilder.Entity("TheBiscuitMachine.Data.Models.Machine", b =>
                {
                    b.Navigation("Reports");
                });

            modelBuilder.Entity("TheBiscuitMachine.Data.Models.User", b =>
                {
                    b.Navigation("BiscuitPackages");

                    b.Navigation("Machine");
                });
#pragma warning restore 612, 618
        }
    }
}
