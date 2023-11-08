using ListAPI.DataAccess;
using ListAPI.DTOs;
using ListAPI.Interfaces;
using ListAPI.Models;
using ListAPI.Utils;
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
builder.Services.AddSingleton<ConnexaRabbitMQClient>();

var app = builder.Build();

app.UsePathBase("/connexa/api/list");
app.MapGet("/",() => "List API is running :)");
app.MapGet("/test",() => "List API is running now, no problems...");

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
app.MapGet("/lists/relateds/{idUser}", async ([FromServices] IServiceProvider provider, int idUser) =>
{
	using (var scope = provider.CreateScope())
	{

		var listDataAccess = scope.ServiceProvider.GetService<IListDataAccess>();

		if (listDataAccess != null)
			return Results.Ok(await listDataAccess.GetListsByParticipantOrOwnerAsync(idUser));

		return Results.NotFound();
	}
});
//app.MapGet("/lists/owner/{idOwner}", async ([FromServices] IServiceProvider provider, int idOwner) =>
//{
//	using (var scope = provider.CreateScope())
//	{

//		var listDataAccess = scope.ServiceProvider.GetService<IListDataAccess>();

//		if (listDataAccess != null)
//			return Results.Ok(await listDataAccess.GetListsByOwnerAsync(idOwner));

//		return Results.NotFound();
//	}
//});
app.MapGet("/lists/participant/{idParticipant}", async ([FromServices] IServiceProvider provider, int idParticipant) =>
{
	using (var scope = provider.CreateScope())
	{

		var listDataAccess = scope.ServiceProvider.GetService<IListDataAccess>();

		if (listDataAccess != null)
			return Results.Ok(await listDataAccess.GetListsByParticipantAsync(idParticipant));

		return Results.NotFound();
	}
});
app.MapGet("/lists/{idList}", async ([FromServices] IServiceProvider provider, int idList) =>
{
    using (var scope = provider.CreateScope())
    {

        var listDataAccess = scope.ServiceProvider.GetService<IListDataAccess>();

        if (listDataAccess != null)
            return Results.Ok(await listDataAccess.GetListByIdAsync(idList));

        return Results.NotFound();
    }
});
app.MapDelete("/lists/{idList}", async ([FromServices] IServiceProvider provider, int idList) =>
{
    using (var scope = provider.CreateScope())
    {

        var listDataAccess = scope.ServiceProvider.GetService<IListDataAccess>();

        if (listDataAccess != null)
            return Results.Ok(await listDataAccess.DeleteListAsync(idList));

        return Results.NotFound();
    }
});
app.MapDelete("/member", async ([FromServices] IServiceProvider provider, int idMember) =>
{
    using (var scope = provider.CreateScope())
    {

        var listDataAccess = scope.ServiceProvider.GetService<IListDataAccess>();

        if (listDataAccess != null)
            return Results.Ok(await listDataAccess.DeleteMemberAsync(idMember));

        return Results.NotFound();
    }
});
app.MapPost("/member/{listMember}", async ([FromServices] IServiceProvider provider,[FromBody] ListAPI.DTOs.MemberListDTO listMember) =>
{
    using (var scope = provider.CreateScope())
    {

        var listDataAccess = scope.ServiceProvider.GetService<IListDataAccess>();

        if (listDataAccess != null)
            return Results.Ok(await listDataAccess.SaveMemberAsync(listMember));

        return Results.NotFound();
    }
});
app.MapGet("/member/{idList}", async (int idList, [FromServices] IServiceProvider provider) =>
{
    using (var scope = provider.CreateScope())
    {

        var listDataAccess = scope.ServiceProvider.GetService<IListDataAccess>();

        if (listDataAccess != null)
            return Results.Ok(await listDataAccess.GetMembersByListAsync(idList));

        return Results.NotFound();
    }
});
app.MapGet("/lists/{idList}/items", async ([FromServices] IServiceProvider provider, int idList) =>
{
    using (var scope = provider.CreateScope())
    {

        var listDataAccess = scope.ServiceProvider.GetService<IListDataAccess>();

        if (listDataAccess != null)
            return Results.Ok(await listDataAccess.GetItemListAsync(idList));

        return Results.NotFound();
    }
});
app.MapPost("/lists/{idList}/items", async ([FromServices] IServiceProvider provider, [FromBody] ListAPI.DTOs.ItemListaDTO itemLista) =>
{
    using (var scope = provider.CreateScope())
    {

        var listDataAccess = scope.ServiceProvider.GetService<IListDataAccess>();

        if (listDataAccess != null)
            return Results.Ok(await listDataAccess.SaveItemListAsync(itemLista));

        return Results.NotFound();
    }
});
app.MapDelete("/lists/{idList}/{idItem}", async ([FromServices] IServiceProvider provider, int idList, int idItem) =>
{
    using (var scope = provider.CreateScope())
    {

        var listDataAccess = scope.ServiceProvider.GetService<IListDataAccess>();

        if (listDataAccess != null)
            return Results.Ok(await listDataAccess.DeleteItemListaAsync(idItem));

        return Results.NotFound();
    }
});
app.MapPut("/lists/itemList/{idItemLista}/{checkedItem}", async ([FromServices] IServiceProvider provider, int idItemLista, bool checkedItem) =>
{
    using (var scope = provider.CreateScope())
    {

        var listDataAccess = scope.ServiceProvider.GetService<IListDataAccess>();

        if (listDataAccess != null)
            return Results.Ok(await listDataAccess.CheckItemListaAsync(idItemLista, checkedItem));

        return Results.NotFound();
    }
});



//Feito
//GetListsByParticipantOrOwnerAsync(int idUser); /lists/relateds/{idUser}
//GetListsByOwnerAsync(int idOwner); /lists/owner/{idOwner}
//GetListsByParticipantAsync(int idParticipant); /lists/participant/{idParticipant}
//GetListByIdAsync(int idList); /lists/{idList}
//DeleteListAsync(int idList); /lists/{idList}
//DeleteMemberAsync(int idMember); /members
//SaveMemberAsync(MemberListDTO listMember); /members
//GetMembersByListAsync(int idList); /members

// Endpoints que ainda faltam...

app.Run();
