namespace API.Entities
{
    public class User
    {
        public int Id { get; set; }
        public required string Username { get; set; }
        public required string KnownAs { get; set; }
        public string? PasswordHash { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
