namespace AuthenticationAPI.Interfaces
{
    public interface ICpfService
    {
        bool Validate(string cpf);
    }
}
