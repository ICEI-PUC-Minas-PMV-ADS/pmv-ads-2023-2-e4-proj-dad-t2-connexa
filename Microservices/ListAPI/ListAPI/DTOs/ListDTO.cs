namespace ListAPI.DTOs
{
    public class ListDTO : ErrorRequestBase
    {
        public int ListaId { get; set; }

        public int? UserId { get; set; }

        public bool ListaPublica { get; set; }

        public bool ListaStatus { get; set; }

        public string? ListaDescricao { get; set; }

        public string? ListaTitulo { get; set; }
    }
}
