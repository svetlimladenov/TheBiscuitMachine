using MassTransit;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using System.Reflection;
using TheBiscuitMachine.Web.DependencyInjectionRegistrations;
using TheBiscuitMachine.Web.Hubs;
using TheBiscuitMachine.Web.Middlewares;
using TheBiscuitMachine.Web.Sagas;

namespace TheBiscuitMachine.Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMediator(cfg =>
            {
                cfg.AddSagaStateMachine<BiscuitMachineStateMachine, BiscuitMachineSaga>().InMemoryRepository();

                cfg.AddConsumers(Assembly.GetExecutingAssembly());
            });

            services.AddLoggerFactory(Configuration);

            services.AddSignalR();

            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "TheBiscuitMachine.Web", Version = "v1" });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "TheBiscuitMachine.Web v1"));
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors(Configuration);

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<MachineHub>("/machinehub");
            });
        }
    }
}
