using SyncAPI;
using SyncAPI.Hubs;

var builder = WebApplication.CreateBuilder(args);

Bootstrapper.Register(builder.Services);

builder.Services.AddSignalR();

var app = builder.Build();

app.UsePathBase("/connexa/api/sync");

app.MapHub<RealTimeHub>("/RealTime");

app.MapGet("/",() => "Connexa Sync API is running :)");
app.MapGet("/test",() => "Connexa Sync API is running now, no problems...");


app.Run();
