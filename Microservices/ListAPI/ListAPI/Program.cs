var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UsePathBase("/connexa/list/api");
app.MapGet("/",() => "List API is running :)");
app.MapGet("/test",() => "List Authentication API is running now, no problems...");


app.Run();
