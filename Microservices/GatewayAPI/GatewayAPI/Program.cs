using Ocelot.DependencyInjection;
using Ocelot.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddJsonFile("ocelot.json",optional: false,reloadOnChange: true);
builder.Services.AddOcelot(builder.Configuration);

const string CONNEXA_ORIGIN = "connexaOrigin";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: CONNEXA_ORIGIN,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:19006","http://localhost:3000", "https://connexa-puc.azurewebsites.net", "http://connexa-puc.azurewebsites.net", "https://zlbspi.conteige.cloud", "http://zlbspi.conteige.cloud")
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                            .AllowCredentials();
                      });
});

var app = builder.Build();

app.UseCors(CONNEXA_ORIGIN);
app.MapGet("/",() => "Hello World!");
//app.MapGet("/redis", () =>
//{
//    RedisCloud redisCloud = new RedisCloud();

//    redisCloud.SetRedisValue("chave", "valor");
//    return redisCloud.GetRedisValue("chave");
//});

app.MapControllers();
await app.UseOcelot();

app.Run();