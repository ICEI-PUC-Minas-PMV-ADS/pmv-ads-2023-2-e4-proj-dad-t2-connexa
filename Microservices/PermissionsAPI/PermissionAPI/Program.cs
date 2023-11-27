using Microsoft.AspNetCore.Mvc;
using PermissionAPI.DataAccess;
using PermissionAPI.DTOs;
using PermissionAPI.Interfaces;
using PermissionAPI.Models;
using PermissionAPI.Utils;

var builder = WebApplication.CreateBuilder(args);

const string CONNEXA_ORIGIN = "connexaOrigin";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: CONNEXA_ORIGIN,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:19006")
                            .AllowAnyHeader()
                            .AllowAnyMethod(); // add the allowed origins  
                      });
});
builder.Services.AddDbContext<ConnexaContext>();
builder.Services.AddScoped<IPermissionDataAccess, PermissionDataAccess>();
builder.Services.AddSingleton<ConnexaRabbitMQClient>();

var app = builder.Build();


app.UsePathBase("/connexa/api/permission");

app.MapGet("/",() => "Connexa Permission API is running :)");
app.MapGet("test",() => "Connexa Permission API is running now, no problems...");

app.MapPost("/permission", async ([FromServices] IServiceProvider provider, [FromBody] UserListaRequestDTO user_lista) =>
{
    using (var scope = provider.CreateScope())
    {
        var listDataAccess = scope.ServiceProvider.GetService<IPermissionDataAccess>();

        if (listDataAccess != null)
            return Results.Ok(await listDataAccess.CreatePermissionList(user_lista.UserEmail, user_lista.ListaId, user_lista.UserListaRole));

        return Results.NotFound();

    }

});

app.MapPatch("/permission", async ([FromServices] IServiceProvider provider, [FromBody] UserListaDTO user_lista) =>
{
    using (var scope = provider.CreateScope())
    {
        var listDataAccess = scope.ServiceProvider.GetService<IPermissionDataAccess>();

        if (listDataAccess != null)
            return Results.Ok(await listDataAccess.ModifyUserPermissionList(user_lista.UserId, user_lista.ListaId, user_lista.UserListaStatus, user_lista.UserListaRole));

        return Results.NotFound();

    }

});

app.MapDelete("/permission/listas/{lista_id}/users/{user_id}", async ([FromServices] IServiceProvider provider, int lista_id, int user_id) =>
{
    using (var scope = provider.CreateScope())
    {
        var listDataAccess = scope.ServiceProvider.GetService<IPermissionDataAccess>();

        if (listDataAccess != null)
            return Results.Ok(await listDataAccess.RevokeUserPermissionList(user_id, lista_id));

        return Results.NotFound();
    }

});

app.MapPatch("/permission/listas/{lista_id}", async ([FromServices] IServiceProvider provider, int lista_id, [FromQuery] bool status_public) =>
{
    using (var scope = provider.CreateScope())
    {
        var listDataAccess = scope.ServiceProvider.GetService<IPermissionDataAccess>();

        if (listDataAccess != null)
            return Results.Ok(await listDataAccess.AlterListAccess(lista_id, status_public));

        return Results.NotFound();
    }

});

app.Run();
