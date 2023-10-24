namespace AuthenticationAPI.DTOs
{
    public class CreateOrUpdateUserDTO
    {
        public required string Name { get; set; }
        public required string Document { get; set; }
        public required DateOnly Birthdate { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string SecretQuestion { get; set; }
        public required string SecretAnswer { get; set; }
    }
}
