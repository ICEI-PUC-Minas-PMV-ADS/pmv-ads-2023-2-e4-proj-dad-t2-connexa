using ListAPI.Models;

namespace ListAPI.DTOs
{
    public class ItemListaDTO : ErrorRequestBase
    {
        public int ItemId { get; set; }

        public string ItemNome { get; set; } = null!;

        public string? ItemDescricao { get; set; }

        public int? ListaId { get; set; }

        public bool ItemStatus { get; set; }

    }
}
