using ListAPI.DataAccess;
using ListAPI.DTOs;
using ListAPI.Interfaces;
using ListAPI.Models;
using Microsoft.AspNetCore.Mvc;

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



// Endpoints que ainda faltam...
//GetListsByParticipantOrOwnerAsync(int idUser); /lists/relateds/{idUser}
//GetListsByOwnerAsync(int idOwner); /lists/owner/{idOwner}
//GetListsByParticipantAsync(int idParticipant); /lists/participant/{idParticipant}
//GetListByIdAsync(int idList); /lists/{idList}
//DeleteListAsync(int idList); /lists
//DeleteMemberAsync(int idMember); /members
//SaveMemberAsync(MemberListDTO listMember); /members
//GetMembersByListAsync(int idList); /members

app.Run();
