# FROM registry.tools.gebeya.io/vibranium/vibranium/dotnet-core/aspnet:3.1 AS base
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 8080

ENV ASPNETCORE_URLS=http://*:8080

ARG CONTAINER_USER=etuser
ARG CONTAINER_GROUP=etuser
ARG CONTAINER_USER_ID=1000
ARG CONTAINER_GROUP_ID=1000


RUN groupadd -g 1000 etuser && useradd -u 1000 -g etuser -s /bin/bash etuser

RUN mkdir -p /home/etuser/.vscode-server/extensions \
        /home/etuser/.vscode-server-insiders/extensions \
    && chown -R etuser \
        /home/etuser/.vscode-server \
        /home/etuser/.vscode-server-insiders

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build

COPY . .

WORKDIR src/EmployeeService.API
RUN dotnet restore "EmployeeService.API.csproj"

RUN dotnet build "EmployeeService.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "EmployeeService.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
ENV Deployment_Env "$CI_COMMIT_REF_NAME"
COPY --from=publish /app/publish .
USER etuser
ENTRYPOINT ["dotnet", "EmployeeService.API.dll"]
