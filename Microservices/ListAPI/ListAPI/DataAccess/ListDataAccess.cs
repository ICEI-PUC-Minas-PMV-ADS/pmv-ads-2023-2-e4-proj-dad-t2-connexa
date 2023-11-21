using ListAPI.DTOs;
using ListAPI.Interfaces;
using ListAPI.Models;
using ListAPI.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;

namespace ListAPI.DataAccess
{
    public class ListDataAccess:ControllerBase, IListDataAccess
    {
        private readonly ConnexaRabbitMQClient _connexaRabbitMQClient;
        private readonly ConnexaContext _context;

        private readonly string UPDATE_LIST_QUEUE_NAME = "update-list-obj";
        private readonly string UPDATE_LIST_ITEM_QUEUE_NAME = "update-list-item-obj";

        public ListDataAccess ([FromServices] ConnexaContext context, [FromServices] ConnexaRabbitMQClient connexaRabbitMQClient)
        {
            _context = context;
            _connexaRabbitMQClient = connexaRabbitMQClient;
        }

        public async ValueTask<bool> DeleteListAsync (int idList)
        {
            try
            {
                var item = await _context.Lista.FirstOrDefaultAsync(i => i.ListaId == idList);

                if(item == null)
                    return true;

                var listUsers = await _context.UserLista.Where(ul => ul.ListaId == idList).ToArrayAsync();
                _context.RemoveRange(listUsers);
                await _context.SaveChangesAsync();

                var listItems = await _context.ItemLista.Where(ul => ul.ListaId == idList).ToArrayAsync();
                _context.RemoveRange(listItems);
                await _context.SaveChangesAsync();

                _context.Entry(item).State = EntityState.Deleted;

                return await _context.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                _context.ThrowException(ex.Message);
                return false;
            }   
        }

        public async ValueTask<bool> DeleteMemberAsync (int idParticipant)
        {
            try
            {
                var item = await _context.UserLista.FirstOrDefaultAsync(i => i.UserListaId == idParticipant);

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
                var item = await _context.Lista.FirstOrDefaultAsync(i => i.ListaId == list.ListaId);

                if(item != null)
                {
                    _context.Entry(item).State = EntityState.Modified;
                } else
                {
                    item = new Listum();
                    _context.Entry(item).State = EntityState.Added;
                }

                item.UserId = list.UserId;
                item.ListaDescricao = list.ListaDescricao;
                item.ListaPublica = list.ListaPublica;
                item.ListaStatus = list.ListaStatus;
                item.ListaTitulo = list.ListaTitulo;

                _context.SavedChanges += async (e,s) =>
                {
                    list.ListaId = item.ListaId;
                };

                await _context.SaveChangesAsync();

                var membersIds = await GetMembersFromListAsync(list.ListaId);
                if(membersIds != null)
                {

                    if(membersIds != null)
                    for(int i = 0; i < membersIds.Count();i++)
                    {
                        list.IdUserTarget = membersIds[i];
                        if(list.IdUserTarget > 0)
                            _connexaRabbitMQClient.Publish(UPDATE_LIST_QUEUE_NAME, list);
                    }
                }

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
                              let participants = list.UserLista.ToList()
                              where list.UserId == idUser || list.UserLista.Any()
                              select new ListDTO
                              {
                                  ListaId = list.ListaId,
                                  UserId = list.UserId,
                                  ListaDescricao = list.ListaDescricao,
                                  ListaPublica = list.ListaPublica,
                                  ListaStatus = list.ListaStatus,
                                  ListaTitulo = list.ListaTitulo,
                                  Message = null,
                                  IsOwner = list.UserId == idUser,
                                  Participants = list.UserId == idUser ? participants.Select(s => new Participant()
                                  {     
                                      IdParticipant = s.UserListaId,
                                      Email = s.User.UserEmail,  
                                      IdList = s.Lista.ListaId,
                                      IdUser = s.UserId ?? 0
                                  }).ToArray() : Array.Empty<Participant>()
                              })
                                .OrderByDescending((ob) => ob.IsOwner)
                                .ToListAsync();

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
                var item = await _context.UserLista.FirstOrDefaultAsync(i => i.UserListaId == listMember.UserListaId);

                if(item == null)
                {
                    item = new UserListum();
                    _context.Entry(item).State = EntityState.Added;
                } else
                {
                    _context.Entry(item).State = EntityState.Modified;
                }

                item.ListaId = listMember.UserListaId;
                item.UserId = listMember.UserId;
                item.UserListaStatus = listMember.UserListaStatus;
                item.UserListaRole = listMember.UserListaRole;                

                _context.SavedChanges += (e,s) =>
                {
                    listMember.ListaId = item.ListaId;
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
        public async Task<int[]> GetMembersFromListAsync (int listId)
        {
            return await _context.UserLista
                                .Where(w => w.ListaId == listId)
                                .Select(s => s.UserId ?? 0)
                                .ToArrayAsync();
        }

        public async ValueTask<IEnumerable<ItemListaDTO>> GetItemListAsync(int idList)
        {
            try
            {
                return await (from itemLista in _context.ItemLista
                              where itemLista.ListaId == idList
                              select new ItemListaDTO
                              {
                                  Id = itemLista.ItemId,
                                  Nome = itemLista.ItemNome,
                                  Descricao = itemLista.ItemDescricao,
                                  ListaId = itemLista.ListaId,
                                  Status = itemLista.ItemStatus,
                                  NomeLista = itemLista.Lista.ListaTitulo ?? "Nome da lista"
                              }).ToListAsync();
            }
            catch (Exception ex)
            {
                _context.ThrowException(ex.Message);
                return Enumerable.Empty<ItemListaDTO>();
            }
        }
        public async ValueTask<ItemListaDTO> SaveItemListAsync(ItemListaDTO itemList)
        {
            try
            {
                if(string.IsNullOrEmpty(itemList.Nome) || string.IsNullOrEmpty(itemList.Descricao))
                    return null;

                var item = await _context.ItemLista.FirstOrDefaultAsync(i => i.ItemId == itemList.Id);

                if (item != null)
                {
                    _context.Entry(item).State = EntityState.Modified;
                }
                else
                {
                    item = new ItemListum();
                    _context.Entry(item).State = EntityState.Added;
                }

                item.ItemNome = itemList.Nome;
                item.ItemDescricao = itemList.Descricao;
                item.ListaId = itemList.ListaId;
                item.ItemStatus = itemList.Status;

                _context.SavedChanges += async (e, s) =>
                {
                    itemList.Id = item.ItemId;
                };

                await _context.SaveChangesAsync();

                var membersIds = await GetMembersFromListAsync(item.ListaId ?? 0);

                if(membersIds != null)
                {
                    var allMembers = new List<int>(membersIds);
                    allMembers.Add(await GetListOwnerId(item.ListaId ?? 0));

                    if(allMembers != null && allMembers.Count() > 0)
                        for(int i = 0; i < allMembers.Count() ;i++)
                        {
                            itemList.IdUserTarget = allMembers[i];
                            if(itemList.IdUserTarget > 0)
                                _connexaRabbitMQClient.Publish(UPDATE_LIST_ITEM_QUEUE_NAME, itemList);
                        }
                }

                return itemList;
            }
            catch (Exception ex)
            {
                _context.ThrowException(ex.Message);
                return new ItemListaDTO()
                {
                    Message = ex.Message,
                };
            }
        }
        public async ValueTask<bool> DeleteItemListaAsync(int idItemLista)
        {
            try
            {
                var item = await _context.ItemLista.FirstOrDefaultAsync(i => i.ItemId == idItemLista);

                if (item == null)
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

        public async Task<int> GetListOwnerId (int listId)
        {
            if(listId == 0)
                return 0;

            var list = await _context.Lista.FirstOrDefaultAsync(f => f.ListaId == listId);
            if(list != null)
                return list.UserId ?? 0;
            return 0;
        }
    }
}
