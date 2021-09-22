FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src

COPY server ./
RUN dotnet restore "TheBiscuitMachine.sln"

WORKDIR /src/Web/TheBiscuitMachine.Web
#Publish in /app/build
RUN dotnet publish -c Release -o /app/build

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:5.0
WORKDIR /app
COPY --from=build /app/build .
EXPOSE 80
ENTRYPOINT ["dotnet", "TheBiscuitMachine.Web.dll"]