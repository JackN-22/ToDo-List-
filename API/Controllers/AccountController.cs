using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections;
using System.Security.Claims;

namespace API.Controllers
{
    public class AccountController(DataContext _context, ITokenService tokenService, IMapper mapper, ITodoItemRepositary todoItemRepositary) : BaseController
    {
        [HttpPost("register")] // api/account/register
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await _context.Users.AnyAsync(u => u.Username == registerDto.Username))
            {
                return BadRequest("Username already exists");
            }

            var user = mapper.Map<User>(registerDto);

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new UserDto
            {
                Username = user.Username,
                Token = await tokenService.CreateToken(user),
                Knownas = user.KnownAs
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {

            var user = await _context.Users.FirstOrDefaultAsync(x => x.Username == loginDto.Username.ToLower());

            if (user == null) return BadRequest("Invalid username");

            if (!await _context.Users.AnyAsync(u => u.Username == loginDto.Username)) return BadRequest("No username matches an account within the database");

            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            {
                return BadRequest("Invalid password");
            }


            return new UserDto
            {
                Username = user.Username,
                Knownas = user.KnownAs,
                Token = await tokenService.CreateToken(user)
            };
        }

        [HttpPost("add-todoitem")]
        public async Task<ActionResult<UserDto>> AddToDoItem(ToDoItemDto toDoItemDto)
        {
            if (toDoItemDto == null)
            {
                return BadRequest("ToDo item is required...");
            }

            var username = User.FindFirst(ClaimTypes.Name)?.Value;

            if (string.IsNullOrEmpty(username))
            {
                return Unauthorized("User is not logged in");
            }

            var item = new ToDoItem
            {
                Name = toDoItemDto.Name,
                Username = username,
                CreatedDate = DateTime.Now,
                DueDate = toDoItemDto.DueDate
            };

            _context.ToDoItems.Add(item);
            await _context.SaveChangesAsync();

            return Ok(item);
        }

        [HttpDelete("delete-todoitem/{toDoItemId}")]
        public async Task<ActionResult> DeleteToDoItem(int toDoItemId)
        {
            var toDoItem = await todoItemRepositary.GetToDoItem(toDoItemId);

            var username = User.FindFirst(ClaimTypes.Name)?.Value;

            Console.WriteLine(toDoItem);

            if (toDoItem == null) return BadRequest("Cannot delete this item");

            if (username != toDoItem.Username) return Forbid();

            todoItemRepositary.DeleteToDoItem(toDoItem);

            if (await todoItemRepositary.Complete()) return Ok(new { message = "Deleted the item!" });

            return BadRequest(new { message = "Problem deleting the item" });
        }

        [HttpGet("getitemsforuser")]
        public async Task<IActionResult> GetItemsForCurrentUser()
        {
            var username = User.FindFirst(ClaimTypes.Name)?.Value;

            // if (username == null) return BadRequest("User not authenticated");

            if (username == null) return BadRequest("unable");

            var toDoItem = await todoItemRepositary.GetItemsForCurrentUser(username);

            return Ok(toDoItem);
        }

        [HttpPut("itemcomplete/{id}")]
        public async Task<ActionResult> MarkItemAsComplete(int id, bool completed)
        {

            var toDoItem = await todoItemRepositary.GetToDoItem(id);
            if (toDoItem == null)
            {
                return NotFound("Item not found");
            }

            // Check if the item is already marked as complete
            if (toDoItem.Completed)
            {
                return BadRequest("Item already complete");
            }

            toDoItem.DateCompleted = DateTime.Now;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Item marked complete!" });
        }

        [HttpGet("itemsnotcomplete")]
        public async Task<IActionResult> GetUnCompletedItems(int id)
        {
            var username = User.FindFirst(ClaimTypes.Name)?.Value;

            if (username == null) return BadRequest("User not authenticated");

            var unComplete = await todoItemRepositary.GetUnCompletedItems(username);

            return Ok(unComplete);

        }
    }
}
