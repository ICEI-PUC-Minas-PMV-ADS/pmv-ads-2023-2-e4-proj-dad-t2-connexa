using PermissionAPI.Models;

namespace PermissionAPI.DTOs
{
    public class ListDTO
    {
        public int ListaId { get; set; }

        public int? UserId { get; set; }

        public bool ListaPublica { get; set; }

        public bool ListaStatus { get; set; }

        public string? ListaDescricao { get; set; }

        public string? ListaTitulo { get; set; }
        public bool IsOwner { get; set; }
        public int IdUserTarget { get; set; }

        public ListDTO()
        {
            
        }

        public void CopyFromListDb (Lista list)
        {
            this.ListaId = list.ListaId;
            this.UserId = list.UserId;
            this.ListaPublica = list.ListaPublica;
            this.ListaStatus = list.ListaStatus;
            this.ListaDescricao = list.ListaDescricao;
            this.ListaTitulo = list.ListaTitulo;
        }
    }
}
