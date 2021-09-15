using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using TheBiscuitMachine.Web.Utilities;

namespace TheBiscuitMachine.Web.Middlewares
{
    public static class CorsSetup
    {
        private const string OriginsKey = "Origins";

        public static IApplicationBuilder UseCors(this IApplicationBuilder app, IConfiguration configuration)
        {
            var origins = configuration.GetArraySection(OriginsKey);
            app.UseCors(builder =>
            {
                builder.WithOrigins(origins)
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            });

            return app;
        }
    }
}
