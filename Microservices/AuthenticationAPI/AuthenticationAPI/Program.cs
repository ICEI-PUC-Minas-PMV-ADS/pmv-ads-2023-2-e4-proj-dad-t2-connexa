using AuthenticationAPI.Clients;
using AuthenticationAPI.DataAcess;
using AuthenticationAPI.DTOs;
using AuthenticationAPI.Interfaces;
using AuthenticationAPI.Models;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

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
builder.Services.AddScoped<IUserDataAccess, UserDataAccess>();

var app = builder.Build();

app.UsePathBase("/connexa/api/authentication");
app.MapGet("/",() => "Connexa Authentication API is running :)");
app.MapGet("/test",() => "List Authentication API is running now, no problems...");

app.MapGet("/users", async ([Required][FromQuery] string email, [FromServices] IServiceProvider provider) =>
{
    using var scope = provider.CreateScope();

    var userDataAcess = scope.ServiceProvider.GetService<IUserDataAccess>();

    if (userDataAcess == null)
        return Results.Problem(detail: "Erro interno do servidor.", statusCode: StatusCodes.Status500InternalServerError);

    var user = await userDataAcess.GetUserByEmailAsync(email);

    return Results.Ok(user);
});

app.MapPost("/users", async ([Required][FromBody] CreateUserDTO createUserDTO, [FromServices] IServiceProvider provider) =>
{
    using var scope = provider.CreateScope();

    var userDataAcess = scope.ServiceProvider.GetService<IUserDataAccess>();

    if (userDataAcess == null)
        return Results.Problem(detail: "Erro interno do servidor.", statusCode: StatusCodes.Status500InternalServerError);

    var success = await userDataAcess.SaveUserAsync(createUserDTO.Email, createUserDTO.Password, createUserDTO.Name, createUserDTO.Status);

    if (!success)
        return Results.Problem(detail: "Erro ao salvar usuário.", statusCode: StatusCodes.Status400BadRequest);

    return Results.StatusCode(StatusCodes.Status201Created);
});

app.MapDelete("/users", async ([Required][FromQuery] string email, [FromServices] IServiceProvider provider) =>
{
    using var scope = provider.CreateScope();

    var userDataAcess = scope.ServiceProvider.GetService<IUserDataAccess>();

    if (userDataAcess == null)
        return Results.Problem(detail: "Erro interno do servidor.", statusCode: StatusCodes.Status500InternalServerError);

    var success = await userDataAcess.DeleteUserAsync(email);

    if (!success)
        return Results.Problem(detail: "Erro ao excluir o usuário.", statusCode: StatusCodes.Status400BadRequest);

    return Results.StatusCode(StatusCodes.Status204NoContent);
});

app.MapPost("/users/validate", async ([Required][FromBody] LoginUserDTO loginUserDTO, [FromServices] IServiceProvider provider) =>
{
    using var scope = provider.CreateScope();

    var userDataAcess = scope.ServiceProvider.GetService<IUserDataAccess>();

    if (userDataAcess == null)
        return Results.Problem(detail: "Erro interno do servidor.", statusCode: StatusCodes.Status500InternalServerError);

    var success = await userDataAcess.ValidateLoginUserAsync(loginUserDTO);

    if (!success)
        return Results.Problem(detail: "Não validado.", statusCode: StatusCodes.Status400BadRequest);

    return Results.StatusCode(StatusCodes.Status200OK);
});

app.MapGet("/redis", async ([FromServices] IServiceProvider provider) =>
{
    using var scope = provider.CreateScope();

    var redis = new RedisCloud();

    redis.SetRedisValue("chave", "valor");

    return redis.GetRedisValue("chave");
});

app.Run();