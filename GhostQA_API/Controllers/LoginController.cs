﻿using GhostQA_API.DTO_s;
using GhostQA_API.Helper;
using GhostQA_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace GhostQA_API.Controllers
{
    [AllowAnonymous]
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly DBHelper _helper;

        public LoginController(DBHelper helper, UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
            _helper = helper;
        }

        [HttpPost]
        public async Task<IActionResult> LoginAsync(Dto_Login loginDTO)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(loginDTO.Email.ToString());
                if (user != null)
                {
                    if (user.IsDisabled ?? false)
                    {
                        return StatusCode(403, new { status = "error", message = "User account is Disable. Please contact with Administrator" });
                    }
                }

                if (await _userManager.CheckPasswordAsync(user, loginDTO.Password))
                {
                    if (!string.IsNullOrEmpty(loginDTO.Email) && !string.IsNullOrEmpty(loginDTO.Password))
                    {
                        string result = await _helper.VerifyUser(user.Email, user.PasswordHash);
                        if (result.Contains("Success"))
                        {
                            var userRoles = await _userManager.GetRolesAsync(user);

                            var authClaims = new List<Claim>
                        {
                            new(ClaimTypes.Email,loginDTO.Email),
                            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        };

                            foreach (var userRole in userRoles)
                            {
                                authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                            }

                            var token = _helper.GetToken(authClaims);

                            return Ok(new
                            {
                                token = new JwtSecurityTokenHandler().WriteToken(token),
                                expiration = token.ValidTo,
                                result = result
                            });
                        }
                        else
                        {
                            return Ok(new Dto_Response { status = "false", message = result });
                        }
                    }
                    else
                    {
                        return Ok(new Dto_Response { status = "false", message = "User Name or Password Must not be Blank" });
                    }
                }
                else
                {
                    return Ok(new Dto_Response { status = "false", message = "User Name or Password is Wrong" });
                }
            }
            catch (Exception)
            {
                return BadRequest
                ("An error occurred in generating the token");
            }
        }
    }
}