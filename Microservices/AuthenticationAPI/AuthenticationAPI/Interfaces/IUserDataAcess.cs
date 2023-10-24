using AuthenticationAPI.DTOs;

namespace AuthenticationAPI.Interfaces
{
    public interface IUserDataAccess
    {
        ValueTask<bool> SaveUserAsync(CreateOrUpdateUserDTO createOrUpdateUserDTO);
        ValueTask<bool> DeleteUserAsync(string email);
        ValueTask<UserDTO> GetUserByEmailAsync(string email);
        ValueTask<bool> ValidateLoginUserAsync(LoginUserDTO loginUser);
    }
}
