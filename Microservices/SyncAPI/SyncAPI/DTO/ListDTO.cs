﻿namespace SyncAPI.DTO
{
   public class ListDTO
    {
        public int ListaId { get; set; }

        public int? UserId { get; set; }

        public bool ListaPublica { get; set; }

        public bool ListaStatus { get; set; }

        public string? ListaDescricao { get; set; }

        public string? ListaTitulo { get; set; }

        public int IdUserTarget { get; set; }
    }
}
