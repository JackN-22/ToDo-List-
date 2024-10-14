using System;
using API.Entities;

namespace API.Interfaces;

public interface ITodoItemRepositary
{
    void DeleteToDoItem(ToDoItem toDoItem);
    Task<ToDoItem?> GetToDoItem(int toDoItemId);
    Task<IEnumerable<ToDoItem>> GetItemsForCurrentUser(string username);
    Task<IEnumerable<ToDoItem>> GetUnCompletedItems(string username);
    Task<bool> Complete();

}
