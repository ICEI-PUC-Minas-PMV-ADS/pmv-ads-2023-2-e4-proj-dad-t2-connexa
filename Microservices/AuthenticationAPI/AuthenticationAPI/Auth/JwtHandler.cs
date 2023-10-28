using AuthenticationAPI.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

using System.Security.Claims;

using System.Text;

namespace AuthenticationAPI.Auth
{
	public class JwtHandler 
    {
		public string GenerateToken(User user)
		{
			var tokenHandler = new JwtSecurityTokenHandler();
			var key = Encoding.ASCII.GetBytes("sua_chave_secreta");
			var tokenDescriptor = new SecurityTokenDescriptor
			{
				Subject = new ClaimsIdentity(new[]
				{
					new Claim(ClaimTypes.Sid, $"{user.UserId}"),
					new Claim(ClaimTypes.Name, $"{user.UserName}"),
					new Claim(ClaimTypes.DateOfBirth, $"{user.Birthdate:yyyy-MM-dd}")
				}),
				Expires = DateTime.UtcNow.AddHours(1),
				SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
			};

			var token = tokenHandler.CreateToken(tokenDescriptor);
			return (tokenHandler.WriteToken(token));
		}
	}

    
}
