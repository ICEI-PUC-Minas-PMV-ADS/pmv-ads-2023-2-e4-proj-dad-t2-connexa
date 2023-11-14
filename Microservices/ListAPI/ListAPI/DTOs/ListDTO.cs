

using ListAPI.Models;

namespace ListAPI.DTOs
{
    public class ListDTO : ErrorRequestBase, IRealTime
    {
        public int ListaId { get; set; }

        public int? UserId { get; set; }

        public bool ListaPublica { get; set; }

        public bool ListaStatus { get; set; }

        public string? ListaDescricao { get; set; }

        public string? ListaTitulo { get; set; }
        public bool IsOwner { get; set; }
        public Participant[] Participants { get; set; } = Array.Empty<Participant>();
        public int IdUserTarget { get; set; }
    }
}
