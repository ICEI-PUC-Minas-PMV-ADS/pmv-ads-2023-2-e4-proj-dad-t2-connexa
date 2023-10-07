using Microsoft.AspNetCore.SignalR;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using GatewayAPI.Clients;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddJsonFile("ocelot.json",optional: false,reloadOnChange: true);
builder.Services.AddOcelot(builder.Configuration);

var app = builder.Build();

app.MapGet("/",() => "Hello World!");
app.MapGet("/redis", () =>
{
    RedisCloud redisCloud = new RedisCloud();

    redisCloud.SetRedisValue("chave", "valor");
    return redisCloud.GetRedisValue("chave");
});

app.MapControllers();
await app.UseOcelot();

app.Run();