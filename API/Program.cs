using System.Text;
using API.Data;
using API.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddIdentityServices(builder.Configuration);

builder.Services.AddApplicationServices(builder.Configuration);


// Add services to the container


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder => builder.WithOrigins("http://localhost:4200") // your Angular app's URL
                          .AllowAnyHeader()
                          .AllowAnyMethod());
});

// Build the app
var app = builder.Build();

// Configure the HTTP request pipeline
app.UseCors(x => x
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials()
    .WithOrigins("http://localhost:4200", "https://localhost:4200")); // Enable CORS for specific frontend origins

app.UseAuthentication();
app.UseAuthorization(); // Add authorization middleware

app.MapControllers(); // Map controller routes

app.Run(); // Run the application
