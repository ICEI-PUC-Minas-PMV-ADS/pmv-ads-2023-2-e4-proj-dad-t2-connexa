using AuthenticationAPI.DTOs;
using AuthenticationAPI.Models;

namespace AuthenticationAPI.Interfaces
{
    public interface IUserDataAccess
    {
        ValueTask<bool> SaveUserAsync(CreateOrUpdateUserDTO createOrUpdateUserDTO);
        ValueTask<bool> DeleteUserAsync(string email);
        ValueTask<UserDTO> GetUserByEmailAsync(string email);
        ValueTask<bool> ValidateLoginUserAsync(LoginUserDTO loginUser);
        ValueTask<string?> GetSecretQuestionAsync(string email);
    }
}
