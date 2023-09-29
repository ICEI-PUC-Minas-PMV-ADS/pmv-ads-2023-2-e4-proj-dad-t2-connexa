using AuthenticationAPI.DTOs;
using AuthenticationAPI.Interfaces;
using AuthenticationAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuthenticationAPI.DataAcess
{
    public class UserDataAccess : ControllerBase, IUserDataAccess
    {
        private readonly ConnexaContext _context;
        public UserDataAccess([FromServices] ConnexaContext context)
        {
            _context = context;
        }
        public async ValueTask<UserDTO> GetUserByEmailAsync(string email)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserEmail == email);

                if (user == null)
                    return new UserDTO()
                    {
                        Message = "Usuário não encontrado por esse email."
                    };

                return new UserDTO()
                {
                    UserId = user.UserId,
                    UserName = user.UserName,
                    PswhHash = user.PswhHash,
                    UserEmail = email,
                    UserStatus = user.UserStatus,
                };
            }
            catch (Exception ex)
            {
                _context.ThrowException(ex.Message);
                return new UserDTO()
                {
                    Message = ex.Message
                };
            }
        }

        public async ValueTask<bool> SaveUserAsync(string email, string password, string nome, bool status = true)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserEmail == email);

                if (user == null) // user novo
                {
                    var newUser = new User()
                    {
                        UserName = nome,
                        PswhHash = password,
                        UserEmail = email,
                        UserStatus = true,
                    };

                    _context.Users.Add(newUser);
                    await _context.SaveChangesAsync();

                    return true;
                }
                else // user existente
                {
                    user.UserName = nome;
                    user.UserEmail = email;
                    user.PswhHash = password;
                    user.UserStatus = status;

                    _context.Users.Update(user);
                    await _context.SaveChangesAsync();

                    return true;
                }
            }
            catch (Exception ex)
            {
                _context.ThrowException("Erro ao salvar/editar o usuário.");
                return false;
            }
        }

        public async ValueTask<bool> DeleteUserAsync(string email)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserEmail == email);

                if (user == null)
                    return false;

                _context.Users.Remove(user);
                await _context.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                _context.ThrowException("Erro ao deletar o usuário.");
                return false;
            }
        }
        public async ValueTask<bool> ValidateLoginUserAsync(UserDTO user)
        {
            return false;
        }
    }
}
