using System;

namespace API.DTOs
{
    public class ToDoItemDto
    {
        public int ToDoItemId { get; set; }
        public string? Username { get; set; }
        public required string Name { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime? DateCompleted { get; set; }
        public UserDto? User { get; set; }
    }
    
}

