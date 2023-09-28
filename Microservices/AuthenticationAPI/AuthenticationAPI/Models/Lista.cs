using System;
using System.Collections.Generic;

namespace AuthenticationAPI.Models;

public partial class Lista
{
    public int ListaId { get; set; }

    public int? UserId { get; set; }

    public bool ListaPublica { get; set; }

    public bool ListaStatus { get; set; }

    public string? ListaDescricao { get; set; }

    public string? ListaTitulo { get; set; }

    public virtual ICollection<Convite> Convites { get; set; } = new List<Convite>();

    public virtual ICollection<ItemList> ItemLista { get; set; } = new List<ItemList>();

    public virtual User? User { get; set; }

    public virtual ICollection<UserLista> UserLista { get; set; } = new List<UserLista>();
}
