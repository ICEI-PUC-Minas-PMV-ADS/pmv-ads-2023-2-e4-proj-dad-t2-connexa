using PermissionAPI.Interfaces;
using PermissionAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace PermissionAPI.DataAccess
{
    public class PermissionDataAccess : ControllerBase, IPermissionDataAccess
    {
        private readonly ConnexaContext _context;
        enum Role
        {
            ADMIN = 0,
            LEITOR = 1,
            EDITOR = 2,
            BLOCKED = 3
        }
        
        public PermissionDataAccess([FromServices] ConnexaContext context)
        {
            _context = context;
        }

        public async ValueTask<string> CreatePermissionList(string userEmail, int? listaID, int? role)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserEmail == userEmail);
            if (user == null)
            {
                return $"Não existe usuário com o email {userEmail}.";
            }
            try
            {
                var userList = await _context.UserLista.FirstOrDefaultAsync(u => u.UserId == user.UserId && u.ListaId == listaID);

                if (userList == null)
                {

                    var newUserList = new UserLista()
                    {
                        UserId = user.UserId,
                        ListaId = listaID,
                        UserListaStatus = true,
                        UserListaRole = role
                    };

                    _context.UserLista.Add(newUserList);
                    await _context.SaveChangesAsync();

                    return "Usuário adicionado a lista de permissões";
                }
                else if (!userList.UserListaStatus)
                {
                    userList.UserListaRole = role;
                    userList.UserListaStatus = true;

                    _context.UserLista.Update(userList);
                    await _context.SaveChangesAsync();

                    return "Usuário modificado para participar da lista";
                }
                else
                {
                    return $"O usuário '{userEmail}' já possui permissões de edição na lista.";
                }
            }
            catch (Exception ex)
            {
                _context.ThrowException(ex.Message);
                return ex.Message;
            }
        }

        public async ValueTask<bool> ModifyUserPermissionList(int? userID, int? listaID, bool status, int? role)
        {
            try
            {
                var userList = await _context.UserLista.FirstOrDefaultAsync(u => u.UserId == userID && u.ListaId == listaID);
                if (userList == null)
                {
                    throw new Exception($"Não foi possível encontrar o usuário {userID} para a lista {listaID}.");
                }
                else
                {
                    userList.UserListaRole = role;
                    userList.UserListaStatus = status;

                    _context.UserLista.Update(userList);
                    await _context.SaveChangesAsync();

                    return true;
                }
            }
            catch (Exception ex)
            {
                _context.ThrowException(ex.Message);
                return false;
            }
        }

        public async ValueTask<bool> RevokeUserPermissionList(int userID, int listaID)
        {
            try
            {
                var userList = await _context.UserLista.FirstOrDefaultAsync(u => u.UserId == userID && u.ListaId == listaID);
                if (userList == null)
                {
                    throw new Exception($"Não foi possível encontrar o usuário {userID} para a lista {listaID}");
                }
                else
                {
                    userList.UserListaRole = (int)Role.BLOCKED;
                    userList.UserListaStatus = false;

                    _context.UserLista.Update(userList);
                    await _context.SaveChangesAsync();

                    return true;
                }
            }
            catch (Exception ex)
            {
                _context.ThrowException(ex.Message);
                return false;
            }
        }

        public async ValueTask<bool> AlterListAccess(int listaID, bool status)
        {
            try
            {
                var lista = await _context.Lista.FirstOrDefaultAsync(l => l.ListaId == listaID);
                if (lista == null)
                {
                    throw new Exception($"Não foi possível encontrar a lista {listaID}.");
                }
                else
                {
                    lista.ListaPublica = status;
                    _context.Lista.Update(lista);
                    await _context.SaveChangesAsync();

                    return true;
                }
            }
            catch (Exception ex)
            {
                _context.ThrowException(ex.Message);
                return false;
            }
        }
    }
}
