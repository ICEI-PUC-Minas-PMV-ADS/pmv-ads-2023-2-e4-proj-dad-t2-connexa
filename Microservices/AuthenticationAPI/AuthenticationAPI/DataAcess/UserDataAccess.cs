using AuthenticationAPI.DTOs;
using AuthenticationAPI.Interfaces;
using AuthenticationAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace AuthenticationAPI.DataAcess
{
    public class UserDataAccess : ControllerBase, IUserDataAccess
    {
        private readonly ConnexaContext _context;
        private readonly ICpfService _cpfService;

        public UserDataAccess(ConnexaContext context, ICpfService cpfService)
        {
            _context = context;
            _cpfService = cpfService;
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
                    PswhHash = "",
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
        public async ValueTask<bool> SaveUserAsync(CreateOrUpdateUserDTO createOrUpdateUserDTO)
        {
            try
            {
                var userFromDatabase = await _context.Users.FirstOrDefaultAsync(u =>
                    u.UserEmail == createOrUpdateUserDTO.Email
                    || u.Document == createOrUpdateUserDTO.Document);

                if (userFromDatabase == null)
                    return await CreateAsync(createOrUpdateUserDTO);

                return await UpdateAsync(createOrUpdateUserDTO, userFromDatabase);
            }
            catch (Exception ex)
            {
                _context.ThrowException($"Erro ao salvar/editar o usuário: {ex}");
                return false;
            }
        }

        private async ValueTask<bool> UpdateAsync(CreateOrUpdateUserDTO createOrUpdateUserDTO, User userFromDatabase)
        {
            var matchCriteria = userFromDatabase.UserEmail.ToLower() == createOrUpdateUserDTO.Email.ToLower()
                                    && userFromDatabase.Document == ClearDocument(createOrUpdateUserDTO.Document)
                                    && userFromDatabase.SecretAnswer.ToLower() == createOrUpdateUserDTO.SecretAnswer.ToLower();

            if (!matchCriteria)
                return false;

            userFromDatabase.PswhHash = createOrUpdateUserDTO.Password;
            userFromDatabase.UserStatus = true;

            _context.Users.Update(userFromDatabase);

            await _context.SaveChangesAsync();

            return true;
        }

        private async ValueTask<bool> CreateAsync(CreateOrUpdateUserDTO createOrUpdateUserDTO)
        {
            var isValidDocument = _cpfService.Validate(createOrUpdateUserDTO.Document);

            if (!isValidDocument)
                return false;

            var newUser = new User()
            {
                UserName = createOrUpdateUserDTO.Name,
                PswhHash = createOrUpdateUserDTO.Password,
                UserEmail = createOrUpdateUserDTO.Email.ToLower(),
                Document = ClearDocument(createOrUpdateUserDTO.Document),
                Birthdate = createOrUpdateUserDTO.Birthdate,
                SecretQuestion = createOrUpdateUserDTO.SecretQuestion,
                SecretAnswer = createOrUpdateUserDTO.SecretAnswer,
                UserStatus = true
            };

            _context.Users.Add(newUser);

            await _context.SaveChangesAsync();

            return true;
        }

        private static string ClearDocument(string document)
        {
            return Regex.Replace(document, @"[^\d]", "");
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

        public async ValueTask<string?> GetSecretQuestionAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserEmail == email);

            if (user == null)
                return null;

            return user.SecretQuestion;
        }

        public async ValueTask<bool> ValidateLoginUserAsync(LoginUserDTO loginUser)
        {
            try
            {
                // TODO aplicar uma funcao de hash com salt aqui
                var passHash = loginUser.Password;

                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserEmail == loginUser.Email && u.PswhHash == passHash);

                if (user == null)
                    return false;

                return true;
            }
            catch (Exception ex)
            {
                _context.ThrowException(ex.Message);
                return false;
            }
        }
    }
}
