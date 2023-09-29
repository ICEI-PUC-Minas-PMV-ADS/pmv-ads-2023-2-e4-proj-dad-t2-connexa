using ListAPI.DTOs;
using ListAPI.Interfaces;
using ListAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ListAPI.DataAccess
{
    public class ListDataAccess:ControllerBase, IListDataAccess
    {
        private readonly ConnexaContext _context;
        public ListDataAccess ([FromServices] ConnexaContext context)
        {
            _context = context;
        }

        public async ValueTask<bool> DeleteListAsync (int idList)
        {
            try
            {
                var item = await _context.Lista.FirstOrDefaultAsync(i => i.ListaId == idList);

                if(item == null)
                    return true;

                _context.Remove(item);

                return await _context.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                _context.ThrowException(ex.Message);
                return false;
            }   
        }

        public async ValueTask<bool> DeleteMemberAsync (int idMember)
        {
            try
            {
                var item = await _context.UserLista.FirstOrDefaultAsync(i => i.UserId == idMember);

                if(item == null)
                    return true;

                _context.Remove(item);

                return await _context.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                _context.ThrowException(ex.Message);
                return false;
            }
        }

        public async ValueTask<ListDTO> GetListByIdAsync (int idList)
        {
            try
            {
                var item = await _context.Lista.FirstOrDefaultAsync(i => i.ListaId == idList);

                if(item == null)
                    return new ListDTO()
                    {
                        Message = "Lista não encontrada..."
                    };

                return new ListDTO()
                {
                    UserId = item.UserId,
                    ListaDescricao = item.ListaDescricao,
                    ListaId = item.ListaId,
                    ListaPublica = item.ListaPublica,
                    ListaStatus = item.ListaStatus,
                    ListaTitulo = item.ListaTitulo
                };
            }
            catch (Exception ex)
            {
                _context.ThrowException(ex.Message);
                return new ListDTO()
                {
                    Message = ex.Message
                };
            }
        }

        public async ValueTask<IEnumerable<ListDTO>> GetListsAsync ()
        {
            try
            {
                return await (from list in _context.Lista
                          select new ListDTO
                          {
                              ListaId = list.ListaId,
                              UserId = list.UserId,
                              ListaDescricao = list.ListaDescricao,
                              ListaPublica = list.ListaPublica,
                              ListaStatus = list.ListaStatus,
                              ListaTitulo = list.ListaTitulo,
                              Message = null
                          }).ToListAsync();
            }
            catch (Exception ex)
            {
                _context.ThrowException(ex.Message);
                return Enumerable.Empty<ListDTO>();
            }
        }

        public async ValueTask<IEnumerable<ListDTO>> GetListsByOwnerAsync (int idOwner)
        {
            try
            {
                return await (from list in _context.Lista
                          where list.UserId == idOwner
                          select new ListDTO
                          {
                              ListaId = list.ListaId,
                              UserId = list.UserId,
                              ListaDescricao = list.ListaDescricao,
                              ListaPublica = list.ListaPublica,
                              ListaStatus = list.ListaStatus,
                              ListaTitulo = list.ListaTitulo,
                              Message = null
                          }).ToListAsync();
            }
            catch (Exception ex)
            {
                _context.ThrowException(ex.Message);
                return Enumerable.Empty<ListDTO>();
            }
        }

        public async ValueTask<IEnumerable<ListDTO>> GetListsByParticipantAsync (int idParticipant)
        {
            try
            {
                return await (from list in _context.Lista
                          join listUser in _context.UserLista
                          on list.ListaId equals listUser.UserId
                          where listUser.UserId == idParticipant
                          select new ListDTO
                          {
                              ListaId = list.ListaId,
                              UserId = list.UserId,
                              ListaDescricao = list.ListaDescricao,
                              ListaPublica = list.ListaPublica,
                              ListaStatus = list.ListaStatus,
                              ListaTitulo = list.ListaTitulo,
                              Message = null
                          }).ToListAsync();
            }
            catch (Exception ex)
            {
                _context.ThrowException(ex.Message);
                return Enumerable.Empty<ListDTO>();
            }
            
        }

        public async ValueTask<ListDTO> SaveListAsync (ListDTO list)
        {
            try
            {
                var isEdit = false;
                var itemModel = new Listum();

                if(list.ListaId > 0)
                {
                    var item = await _context.Lista.FirstOrDefaultAsync(i => i.ListaId == list.ListaId);

                    if(item != null)
                    {
                        itemModel = item;
                        isEdit = true;
                    }   
                }

                itemModel.UserId = list.UserId;
                itemModel.ListaDescricao = list.ListaDescricao;
                itemModel.ListaPublica = list.ListaPublica;
                itemModel.ListaStatus = list.ListaStatus;
                itemModel.ListaTitulo = list.ListaTitulo;

                if(!isEdit)
                    _context.Lista.Add(itemModel);
                else
                    _context.Lista.Update(itemModel);

                _context.SavedChanges += (e,s) =>
                {
                    list.ListaId = itemModel.ListaId;
                };

                await _context.SaveChangesAsync();

                return list;
            }
            catch (Exception ex)
            {
                _context.ThrowException(ex.Message);
                return new ListDTO()
                {
                    Message = ex.Message,
                };
            }
        }

        public async ValueTask<IEnumerable<ListDTO>> GetListsByParticipantOrOwnerAsync(int idUser)
        {
            try
            {

                return await (from list in _context.Lista
                          join listUser in _context.UserLista
                          on list.ListaId equals listUser.UserId
                          where listUser.UserId == idUser || list.UserId == idUser
                          select new ListDTO
                          {
                              ListaId = list.ListaId,
                              UserId = list.UserId,
                              ListaDescricao = list.ListaDescricao,
                              ListaPublica = list.ListaPublica,
                              ListaStatus = list.ListaStatus,
                              ListaTitulo = list.ListaTitulo,
                              Message = null
                          }).ToListAsync();

            }
            catch (Exception ex)
            {
                _context.ThrowException(ex.Message);
                return Enumerable.Empty<ListDTO>();
            }
            
        }

        public async ValueTask<MemberListDTO> SaveMemberAsync (MemberListDTO listMember)
        {
            try
            {
                var isEdit = false;
                var itemModel = new UserListum();

                if(listMember.UserListaId > 0)
                {
                    var item = await _context.UserLista.FirstOrDefaultAsync(i => i.UserListaId == listMember.UserListaId);

                    if(item != null)
                    {
                        itemModel = item;
                        isEdit = true;
                    }
                }

                itemModel.ListaId = listMember.UserListaId;
                itemModel.UserId = listMember.UserId;
                itemModel.UserListaStatus = listMember.UserListaStatus;
                itemModel.UserListaRole = listMember.UserListaRole;                

                if(!isEdit)
                    _context.UserLista.Add(itemModel);
                else
                    _context.UserLista.Update(itemModel);

                _context.SavedChanges += (e,s) =>
                {
                    listMember.ListaId = itemModel.ListaId;
                };

                await _context.SaveChangesAsync();

                return listMember;

            }
            catch (Exception ex)
            {
                _context.ThrowException(ex.Message);
                return new MemberListDTO()
                {
                    Message = ex.Message
                };
            }  
        }

        public async ValueTask<IEnumerable<MemberListDTO>> GetMembersByListAsync (int idList)
        {
            try
            {

                return await (from list in _context.UserLista
                        where list.ListaId == idList
                        select new MemberListDTO
                        {
                            ListaId = list.ListaId,
                            ListaName = list.Lista.ListaTitulo,
                            UserId = list.UserListaId,
                            UserListaId = list.UserListaId,
                            UserListaRole = list.UserListaRole,
                            UserListaStatus = list.UserListaStatus,
                            UserName = list.User.UserName
                        }).ToListAsync();

            }
            catch (Exception ex)
            {
                _context.ThrowException(ex.Message);
                return Enumerable.Empty<MemberListDTO>();
            }
        }
    }
}
