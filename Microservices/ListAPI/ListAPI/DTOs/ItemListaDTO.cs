using ListAPI.Models;

namespace ListAPI.DTOs
{
    public class ItemListaDTO : ErrorRequestBase
    {
        public int Id { get; set; }

        public string Nome { get; set; } = null!;

        public string? Descricao { get; set; }

        public int? ListaId { get; set; }

        public bool Status { get; set; }
        public string NomeLista { get; set; }

    }
}
