using SyncAPI;
using SyncAPI.Hubs;

var builder = WebApplication.CreateBuilder(args);

const string CONNEXA_ORIGIN = "connexaOrigin";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: CONNEXA_ORIGIN,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:19006",
                                             "http://localhost:3000")
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                            .AllowCredentials();
                      });
});

Bootstrapper.Register(builder.Services);

builder.Services.AddSignalR();

var app = builder.Build();

app
    .UseRouting()
    .UseCors(CONNEXA_ORIGIN);

app.UsePathBase("/connexa/api/sync");

app.MapHub<RealTimeHub>("/realtime");

app.MapGet("/",() => "Connexa Sync API is running :)");
app.MapGet("/test",() => "Connexa Sync API is running now, no problems...");


app.Run();
