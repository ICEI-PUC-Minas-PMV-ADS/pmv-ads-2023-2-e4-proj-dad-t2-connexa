using SyncAPI.Interface;

namespace SyncAPI.DTO
{
    public class ItemListDTO: IRealTime
    {
        public int Id { get; set; }

        public string Nome { get; set; } = null!;

        public string? Descricao { get; set; }

        public int? ListaId { get; set; }

        public bool Status { get; set; }
        public string NomeLista { get; set; }
        public int IdUserTarget { get; set; }
    }
}
