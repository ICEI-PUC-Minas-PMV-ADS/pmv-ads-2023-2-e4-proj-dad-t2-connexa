var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UsePathBase("/connexa/authentication/api");

app.MapGet("/",() => "Authentication API is running :)");
app.MapGet("/test",() => "Connexa Authentication API is running now, no problems...");

app.Run();