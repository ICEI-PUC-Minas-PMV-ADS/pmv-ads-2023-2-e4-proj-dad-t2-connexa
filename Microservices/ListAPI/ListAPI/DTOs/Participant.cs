namespace ListAPI.DTOs
{
    public class Participant
    {
        public int IdParticipant { get; set; }
        public string Email { get; set; }
        public int IdUser { get; set; }
        public int IdList { get; set; }
    }
}
