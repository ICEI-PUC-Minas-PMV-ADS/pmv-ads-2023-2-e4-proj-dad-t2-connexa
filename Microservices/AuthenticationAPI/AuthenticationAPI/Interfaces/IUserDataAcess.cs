using AuthenticationAPI.DTOs;

namespace AuthenticationAPI.Interfaces
{
    public interface IUserDataAccess
    {
        ValueTask<bool> SaveUserAsync(string email, string password, string nome, bool status = true);
        ValueTask<bool> DeleteUserAsync(string email);
        ValueTask<UserDTO> GetUserByEmailAsync(string email);
        ValueTask<bool> ValidateLoginUserAsync(UserDTO user);
    }
}
