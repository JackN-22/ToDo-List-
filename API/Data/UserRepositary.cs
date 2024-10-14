using System;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class UserRepositary(DataContext _context) : IUserRepositary
{
    public async Task<User?> GetUserByUsernameAsync(string username)
    {
        return await _context.Users
            .SingleOrDefaultAsync(x => x.Username == username);
    }
}
