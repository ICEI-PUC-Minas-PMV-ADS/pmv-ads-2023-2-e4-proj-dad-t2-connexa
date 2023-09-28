using System;
using System.Collections.Generic;

namespace ListAPI.Models;

public partial class Convite
{
    public int ConviteId { get; set; }

    public int? UserId { get; set; }

    public int? ListaId { get; set; }

    public DateOnly? DataExpiracao { get; set; }

    public virtual Listum? Lista { get; set; }

    public virtual User? User { get; set; }
}
