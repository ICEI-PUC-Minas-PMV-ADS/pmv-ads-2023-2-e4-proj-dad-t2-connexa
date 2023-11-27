using AuthenticationAPI.Auth;
using AuthenticationAPI.Clients;
using AuthenticationAPI.DataAcess;
using AuthenticationAPI.DTOs;
using AuthenticationAPI.Interfaces;
using AuthenticationAPI.Models;
using AuthenticationAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.ComponentModel.DataAnnotations;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

const string CONNEXA_ORIGIN = "connexaOrigin";

builder.Services.AddCors(options =>
{
	options.AddPolicy(name: CONNEXA_ORIGIN,
					  policy =>
					  {
						  policy.WithOrigins("http://localhost:19006", "http://localhost:3000")
							.AllowAnyHeader()
							.AllowAnyMethod();
					  });
});

builder.Services.AddAuthentication(options =>
{
	options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
	options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
	options.TokenValidationParameters = new TokenValidationParameters
	{
		ValidateIssuer = false,
		ValidateAudience = false,
		ValidateIssuerSigningKey = true,
		IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("sua_chave_secreta")),
		ClockSkew = TimeSpan.Zero
	};
});

builder.Services.AddDbContext<ConnexaContext>();
builder.Services.AddScoped<IUserDataAccess, UserDataAccess>();
builder.Services.AddScoped<ICpfService, CpfService>();
builder.Services.AddControllers();

var app = builder.Build();

app.UseCors(CONNEXA_ORIGIN);
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
	endpoints.MapControllers();
});

app.UsePathBase("/connexa/api/authentication");
app.MapGet("/", () => "Connexa Authentication API is running :)");
app.MapGet("/test", () => "List Authentication API is running now, no problems...");

app.Run();