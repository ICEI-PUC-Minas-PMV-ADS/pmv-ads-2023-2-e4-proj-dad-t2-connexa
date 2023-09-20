var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();


app.UsePathBase("/connexa/permission/api");

app.MapGet("/",() => "Connexa Permission API is running :)");
app.MapGet("test",() => "Connexa Permission API is running now, no problems...");


app.Run();
