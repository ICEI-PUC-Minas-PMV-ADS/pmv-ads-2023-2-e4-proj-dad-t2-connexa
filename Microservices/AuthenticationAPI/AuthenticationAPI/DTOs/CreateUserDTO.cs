namespace AuthenticationAPI.DTOs
{
    public class CreateUserDTO
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string Name { get; set; }
        public bool Status { get; set; } = true;
    }
}
