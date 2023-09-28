using System;
using System.Collections.Generic;

namespace ListAPI.Models;

public partial class Listum
{
    public int ListaId { get; set; }

    public int? UserId { get; set; }

    public bool ListaPublica { get; set; }

    public bool ListaStatus { get; set; }

    public string? ListaDescricao { get; set; }

    public string? ListaTitulo { get; set; }

    public virtual ICollection<Convite> Convites { get; set; } = new List<Convite>();

    public virtual ICollection<ItemListum> ItemLista { get; set; } = new List<ItemListum>();

    public virtual User? User { get; set; }

    public virtual ICollection<UserListum> UserLista { get; set; } = new List<UserListum>();
}
