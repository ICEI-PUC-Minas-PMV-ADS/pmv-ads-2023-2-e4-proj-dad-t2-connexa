using ListAPI.DataAccess;
using ListAPI.Interfaces;
using ListAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using System.Collections;

var builder = WebApplication.CreateBuilder(args);

var klugOrigin = "connexaOrigin";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: klugOrigin,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:19006")
                            .AllowAnyHeader()
                            .AllowAnyMethod(); // add the allowed origins  
                      });
});

builder.Services.AddDbContext<ConnexaContext>();
builder.Services.AddScoped<IListDataAccess, ListDataAccess>();

var app = builder.Build();

app.UsePathBase("/connexa/list/api");
app.MapGet("/",() => "List API is running :)");
app.MapGet("/test",() => "List Authentication API is running now, no problems...");
app.MapGet("/lists", async ([FromServices] IServiceProvider provider) =>
{
    using(var scope = provider.CreateScope()) {

        var listDataAccess = scope.ServiceProvider.GetService<IListDataAccess>();

        if(listDataAccess != null)
            return Results.Ok(await listDataAccess.GetListsAsync());

        return Results.NotFound();
    }
});
app.MapPost("/lists", async ([FromServices] IServiceProvider provider, [FromBody] ListAPI.DTOs.ListDTO list) =>
{
    using(var scope = provider.CreateScope()) {

        var listDataAccess = scope.ServiceProvider.GetService<IListDataAccess>();

        if(listDataAccess != null)
            return Results.Ok(await listDataAccess.SaveListAsync(list));

        return Results.NotFound();
    }
});

app.Run();
