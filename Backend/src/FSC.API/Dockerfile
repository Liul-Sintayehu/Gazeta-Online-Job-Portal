#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["src/FSC.API/FSC.API.csproj", "src/FSC.API/"]
COPY ["src/FSC.Application/FSC.Application.csproj", "src/FSC.Application/"]
COPY ["FSC.Infrastructure/FSC.Infrastructure.csproj", "FSC.Infrastructure/"]
RUN dotnet restore "src/FSC.API/FSC.API.csproj"
COPY . .
WORKDIR "/src/src/FSC.API"
RUN dotnet build "FSC.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "FSC.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "FSC.API.dll"]