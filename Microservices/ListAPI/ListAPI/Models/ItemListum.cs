using System;
using System.Collections.Generic;

namespace ListAPI.Models;

public partial class ItemListum
{
    public int ItemId { get; set; }

    public string ItemNome { get; set; } = null!;

    public string? ItemDescricao { get; set; }

    public int? ListaId { get; set; }

    public bool ItemStatus { get; set; }

    public virtual Listum? Lista { get; set; }
}
