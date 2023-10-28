using AuthenticationAPI.Auth;
using AuthenticationAPI.DTOs;
using AuthenticationAPI.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace AuthenticationAPI.Controllers
{

	[ApiController]
	[Route("users")]
	public class UserController : ControllerBase
	{
		public readonly IUserDataAccess _userDataAccess;
		public readonly JwtHandler _jwtHandler;
		public UserController(IUserDataAccess userDataAccess)
		{
			_userDataAccess = userDataAccess;
			_jwtHandler = new JwtHandler();
		}

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)] //Autorização JWT
        [HttpGet()]
		public async Task<ActionResult> UserByEmail([Required][FromQuery] string email)
		{
			var response = await _userDataAccess.GetUserByEmailAsync(email);

			return Ok(response);
		}

		[HttpPost()]
		public async Task<ActionResult> CreateUser([Required][FromBody] CreateOrUpdateUserDTO createOrUpdateUserDTO)
		{
			var response = await _userDataAccess.SaveUserAsync(createOrUpdateUserDTO);

			if (!response)
				return Problem(detail: "Erro ao salvar usuário.", statusCode: StatusCodes.Status400BadRequest);

			return StatusCode(StatusCodes.Status201Created);
		}

		[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)] //Autorização JWT
		[HttpDelete()]
		public async Task<ActionResult> DeleteUser([Required][FromQuery] string email)
		{
			var response = await _userDataAccess.DeleteUserAsync(email);

			if (!response)
				return Problem(detail: "Erro ao excluir o usuário.", statusCode: StatusCodes.Status400BadRequest);

			return StatusCode(StatusCodes.Status204NoContent);

		}

		[HttpPost("validate")]
		public async Task<ActionResult> ValidateUser([Required][FromBody] LoginUserDTO loginUserDTO)
		{
			var userId = await _userDataAccess.ValidateLoginUserAsync(loginUserDTO);

			if (userId == null)
				return Problem(detail: "Não validado.", statusCode: StatusCodes.Status400BadRequest);

			var token = _jwtHandler.GenerateToken(userId);

			return Ok(token);
		}

		[HttpGet("secret-question")]
		public async Task<ActionResult> GetSecretQuestion([Required][FromQuery] string email)
		{
			var response = await _userDataAccess.GetSecretQuestionAsync(email);

			if (response == null)
				return NotFound("O usuário não existe.");

			return Ok(response);
		}
	}
}
