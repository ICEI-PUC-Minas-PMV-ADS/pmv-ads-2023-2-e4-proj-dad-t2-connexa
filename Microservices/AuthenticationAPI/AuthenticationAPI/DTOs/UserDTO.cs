﻿using AuthenticationAPI.Models;

namespace AuthenticationAPI.DTOs
{
    public class UserDTO : ErrorRequestBase
    {
        public int UserId { get; set; }

        public string UserName { get; set; } = null!;

        public string PswhHash { get; set; } = null!;

        public string UserEmail { get; set; } = null!;

        public bool UserStatus { get; set; }

        public virtual ICollection<Convite> Convites { get; set; } = new List<Convite>();

        public virtual ICollection<Lista> Lista { get; set; } = new List<Lista>();

        public virtual ICollection<UserLista> UserLista { get; set; } = new List<UserLista>();
    }
}
