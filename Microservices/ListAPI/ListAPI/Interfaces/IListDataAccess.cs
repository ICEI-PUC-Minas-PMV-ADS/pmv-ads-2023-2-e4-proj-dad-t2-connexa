using ListAPI.DTOs;
using ListAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace ListAPI.Interfaces
{
    public interface IListDataAccess
    {
        ValueTask<IEnumerable<ListDTO>> GetListsAsync();
        ValueTask<IEnumerable<ListDTO>> GetListsByParticipantOrOwnerAsync(int idUser);
        ValueTask<IEnumerable<ListDTO>> GetListsByOwnerAsync(int idOwner);
        ValueTask<IEnumerable<ListDTO>> GetListsByParticipantAsync(int idParticipant);
        ValueTask<ListDTO> GetListByIdAsync(int idList);
        ValueTask<ListDTO> SaveListAsync(ListDTO list);
        ValueTask<bool> DeleteListAsync(int idList);
        ValueTask<bool> DeleteMemberAsync(int idMember);
        ValueTask<MemberListDTO> SaveMemberAsync(MemberListDTO listMember);
        ValueTask<IEnumerable<MemberListDTO>> GetMembersByListAsync(int idList);
        ValueTask<IEnumerable<ItemListDTO>> GetListItemsByListID (int idList);
    }
}
