var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();


app.UsePathBase("/connexa/api/sync");

app.MapGet("/",() => "Connexa Sync API is running :)");
app.MapGet("/test",() => "Connexa Sync API is running now, no problems...");


app.Run();
