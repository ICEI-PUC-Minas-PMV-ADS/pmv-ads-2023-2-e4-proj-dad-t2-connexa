using System;
using System.Collections.Generic;

namespace ListAPI.Models;

public partial class User
{
    public int UserId { get; set; }

    public string UserName { get; set; } = null!;

    public string PswhHash { get; set; } = null!;

    public string UserEmail { get; set; } = null!;

    public bool UserStatus { get; set; }

    public virtual ICollection<Convite> Convites { get; set; } = new List<Convite>();

    public virtual ICollection<Listum> Lista { get; set; } = new List<Listum>();

    public virtual ICollection<UserListum> UserLista { get; set; } = new List<UserListum>();
}
