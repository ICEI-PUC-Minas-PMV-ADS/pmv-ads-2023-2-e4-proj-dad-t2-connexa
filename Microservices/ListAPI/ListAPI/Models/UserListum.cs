using System;
using System.Collections.Generic;

namespace ListAPI.Models;

public partial class UserListum
{
    public int UserListaId { get; set; }

    public int? ListaId { get; set; }

    public int? UserId { get; set; }

    public bool UserListaStatus { get; set; }

    public int? UserListaRole { get; set; }

    public virtual Listum? Lista { get; set; }

    public virtual User? User { get; set; }
}
