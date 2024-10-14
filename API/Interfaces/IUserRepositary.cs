using System;
using API.Entities;

namespace API.Interfaces;

public interface IUserRepositary
{
    Task<User?> GetUserByUsernameAsync(string username);

}
