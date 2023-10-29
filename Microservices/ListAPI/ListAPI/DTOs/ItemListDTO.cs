namespace ListAPI.DTOs
{
    public class ItemListDTO
    {
        public int Id { get; set; }

        public string Nome { get; set; } = null!;

        public string? Descricao { get; set; }

        public int? ListaId { get; set; }

        public bool Status { get; set; }
    }
}
