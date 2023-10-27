using AuthenticationAPI.Clients;
using Microsoft.AspNetCore.Mvc;

namespace AuthenticationAPI.Controllers
{
	[ApiController]
	[Route("redis")]
	public class RedisController : ControllerBase
	{
		[HttpGet()]
		public ActionResult Redis()
		{
			var redis = new RedisCloud();

			redis.SetRedisValue("chave", "valor");

			redis.GetRedisValue("chave");

			return Ok(redis.GetRedisValue("chave"));
		}
	}
}