FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src

COPY server/Application/TheBiscuitMachine.Application/TheBiscuitMachine.Application.csproj ./Application/TheBiscuitMachine.Application/
COPY server/Data/TheBiscuitMachine.Data/TheBiscuitMachine.Data.csproj ./Data/TheBiscuitMachine.Data/
COPY server/Infrastructure/TheBiscuitMachine.Infrastructure/TheBiscuitMachine.Infrastructure.csproj ./Infrastructure/TheBiscuitMachine.Infrastructure/
COPY server/Tests/TheBiscuitMachine.Tests/TheBiscuitMachine.Tests.csproj ./Tests/TheBiscuitMachine.Tests/
COPY server/Web/TheBiscuitMachine.Web/TheBiscuitMachine.Web.csproj ./Web/TheBiscuitMachine.Web/

RUN dotnet restore ./Web/TheBiscuitMachine.Web/TheBiscuitMachine.Web.csproj

COPY server ./

WORKDIR /src/Web/TheBiscuitMachine.Web
#Publish in /app/build
RUN dotnet publish --no-restore -c Release -o /app/build

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:5.0
WORKDIR /app
COPY --from=build /app/build .
EXPOSE 80
ENTRYPOINT ["dotnet", "TheBiscuitMachine.Web.dll"]