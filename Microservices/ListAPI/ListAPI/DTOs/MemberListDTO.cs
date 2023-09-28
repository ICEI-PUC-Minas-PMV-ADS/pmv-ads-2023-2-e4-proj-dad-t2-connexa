using ListAPI.Models;

namespace ListAPI.DTOs
{
    public class MemberListDTO : ErrorRequestBase
    {
        public int UserListaId { get; set; }

        public int? ListaId { get; set; }

        public int? UserId { get; set; }

        public bool UserListaStatus { get; set; }

        public int? UserListaRole { get; set; }

        public string ListaName { get; set; }

        public string UserName { get; set; }
    }
}
