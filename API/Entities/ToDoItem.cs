using System;

namespace API.Entities;

public class ToDoItem
{
        public int TodoItemId { get; set; }
        public required string Username { get; set; }
        public required string Name { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime DueDate { get; set; }
        public bool Completed { get; set; }
        public DateTime? DateCompleted { get; set; }
}
