using System;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class TodoItemRepositary(DataContext _context) : ITodoItemRepositary
{
    public async Task<bool> Complete()
    {
        return await _context.SaveChangesAsync() > 0;
    }

    public void DeleteToDoItem(ToDoItem toDoItem)
    {
        _context.ToDoItems.Remove(toDoItem);
    }

    public async Task<IEnumerable<ToDoItem>> GetItemsForCurrentUser(string username)
    {
        return await _context.ToDoItems
            .Where(x => x.Username == username)
            .ToListAsync();
    }

    public async Task<ToDoItem?> GetToDoItem(int toDoItemId)
    {

        if (toDoItemId > 0) 
        {
            return await _context.ToDoItems.FindAsync(toDoItemId);
        }
        else
        {
            return null;
        }
    }

    public async Task<IEnumerable<ToDoItem>> GetUnCompletedItems(string username)
    {
        return await _context.ToDoItems
            .Where(x => x.Completed == false)
            .Where(x => x.Username == username)
            .ToListAsync();
    }
}
