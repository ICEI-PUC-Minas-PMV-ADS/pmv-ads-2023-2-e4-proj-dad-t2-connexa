using Microsoft.Extensions.Configuration;
using SyncAPI;
using SyncAPI.Hubs;
using SyncAPI.Interface;

var builder = WebApplication.CreateBuilder(args);

Bootstrapper.Register(builder.Services);

builder.Services.AddSignalR();

var app = builder.Build();

app.MapHub<RealTimeHub>("/RealTime");

app.UsePathBase("/connexa/api/sync");

app.MapGet("/",() => "Connexa Sync API is running :)");
app.MapGet("/test",() => "Connexa Sync API is running now, no problems...");


app.Run();
