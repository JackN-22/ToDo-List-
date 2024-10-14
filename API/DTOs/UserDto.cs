using System;

namespace API.DTOs;

public class UserDto
{
    public required string Username { get; set; }
    public required string Knownas { get; set; }
    public required string Token { get; set; }
    //public required string Password { get; set; }   
}

