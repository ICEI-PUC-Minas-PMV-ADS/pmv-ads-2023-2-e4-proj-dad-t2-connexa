using System;
using System.Collections.Generic;

namespace AuthenticationAPI.Models;

public partial class ItemList
{
    public int ItemId { get; set; }

    public string ItemNome { get; set; } = null!;

    public string? ItemDescricao { get; set; }

    public int? ListaId { get; set; }

    public bool ItemStatus { get; set; }

    public virtual Lista? Lista { get; set; }
}
