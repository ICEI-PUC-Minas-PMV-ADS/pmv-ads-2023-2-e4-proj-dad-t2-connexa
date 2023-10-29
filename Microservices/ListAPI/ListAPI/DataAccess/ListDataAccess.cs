using ListAPI.DTOs;
using ListAPI.Interfaces;
using ListAPI.Models;
using ListAPI.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ListAPI.DataAccess
{
    public class ListDataAccess:ControllerBase, IListDataAccess
    {
        private readonly ConnexaRabbitMQClient _connexaRabbitMQClient;
        private readonly ConnexaContext _context;

        private readonly string UPDATE_LIST_QUEUE_NAME = "update-list-obj";

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

                await DistributeListUpdatesToRelatedUsers(list);

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
							  join listUser in _context.UserLista on list.ListaId equals listUser.UserListaId into listUserGroup
							  from listUser in listUserGroup.DefaultIfEmpty()
							  where list.UserId == idUser || (listUser != null && listUser.UserId == idUser)
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
        public async Task DistributeListUpdatesToRelatedUsers (ListDTO item)
        {
            var members = await _context.UserLista
                                            .Where(w => w.ListaId == item.ListaId)
                                            .Select(s => s.UserId ?? 0)
                                            .ToArrayAsync();

            if(members != null)
                for(int i = 0; i < members.Length;i++)
                {
                    item.IdUserTarget = members[i];
                    if(item.IdUserTarget > 0)
                        _connexaRabbitMQClient.Publish(UPDATE_LIST_QUEUE_NAME, item);
                }
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
        public async ValueTask<ItemListaDTO> SaveItemListAsync(ItemListaDTO ItemLista)
        {
            try
            {
                var item = await _context.ItemLista.FirstOrDefaultAsync(i => i.ItemId == ItemLista.Id);

                if (item != null)
                {
                    _context.Entry(item).State = EntityState.Modified;
                }
                else
                {
                    item = new ItemListum();
                    _context.Entry(item).State = EntityState.Added;
                }

                item.ItemId = ItemLista.Id;
                item.ItemNome = ItemLista.Nome;
                item.ItemDescricao = ItemLista.Descricao;
                item.ListaId = ItemLista.ListaId;
                item.ItemStatus = ItemLista.Status;

                _context.SavedChanges += async (e, s) =>
                {
                    ItemLista.ListaId = item.ListaId;
                };

                await _context.SaveChangesAsync();

                return ItemLista;
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

        public async ValueTask<bool> CheckItemListaAsync (int idItemLista,bool checkedItem)
        {
            var item = await _context.ItemLista.FirstOrDefaultAsync(i => i.ItemId == idItemLista);

            if(item != null)
            {
                item.ItemStatus = checkedItem;
                _context.Entry(item);

                return await _context.SaveChangesAsync() > 0;
            }

            return false;
        }
    }
}
