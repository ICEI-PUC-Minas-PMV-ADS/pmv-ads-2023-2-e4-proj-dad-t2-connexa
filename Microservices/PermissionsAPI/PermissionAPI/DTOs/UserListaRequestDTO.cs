using PermissionAPI.Models;

namespace PermissionAPI.DTOs
{
    public class UserListaRequestDTO
    {
        public required string UserEmail { get; set; }
        public required int? ListaId { get; set; }
        public required int? UserListaRole { get; set; }
    }
}
