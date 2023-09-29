using System;
using System.Collections.Generic;

namespace AuthenticationAPI.Models;

public partial class UserLista
{
    public int UserListaId { get; set; }

    public int? ListaId { get; set; }

    public int? UserId { get; set; }

    public bool UserListaStatus { get; set; }

    public int? UserListaRole { get; set; }

    public virtual Lista? Lista { get; set; }

    public virtual User? User { get; set; }
}
