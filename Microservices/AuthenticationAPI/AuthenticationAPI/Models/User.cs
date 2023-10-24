namespace AuthenticationAPI.Models;

public partial class User
{
    public int UserId { get; set; }
    public required string UserName { get; set; }
    public required string Document { get; set; }
    public required DateOnly Birthdate { get; set; }
    public required string UserEmail { get; set; }
    public required string PswhHash { get; set; }
    public required string SecretQuestion { get; set; }
    public required string SecretAnswer { get; set; }
    public required bool UserStatus { get; set; } = true;

    #region References
    public virtual ICollection<Convite> Convites { get; set; } = new List<Convite>();
    public virtual ICollection<Lista> Lista { get; set; } = new List<Lista>();
    public virtual ICollection<UserLista> UserLista { get; set; } = new List<UserLista>(); 
    #endregion
}
