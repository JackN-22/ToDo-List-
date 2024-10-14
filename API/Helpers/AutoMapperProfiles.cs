using System;
using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<ToDoItemDto, ToDoItem>()
            .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.Username));
        CreateMap<RegisterDto, User>()
            .ForMember(dest => dest.KnownAs,
                        opt => opt.MapFrom(src => src.Knownas));
    }
}
