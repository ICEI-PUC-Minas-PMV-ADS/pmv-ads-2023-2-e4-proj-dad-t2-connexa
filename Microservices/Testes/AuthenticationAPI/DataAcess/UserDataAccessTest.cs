using AuthenticationAPI.DataAcess;
using AuthenticationAPI.DTOs;
using AuthenticationAPI.Interfaces;
using AuthenticationAPI.Models;
using Microsoft.EntityFrameworkCore;
using Moq;
using System.Data.Entity;
using System.Linq.Expressions;
using System.Reflection.Metadata;
using Xunit;

namespace Testes.AuthenticationAPI.DataAcess
{
    public class UserDataAccessTests
    {
        [Fact]
        public async Task GetUserByEmailAsync_ReturnsUserWhenUserExists()
        {
            // Arrange
            var email = "bruno@email.com";
            var document = "01543056261";

            var mockConnexaContext = new Mock<ConnexaContext>();



            var mockCpfService = new Mock<ICpfService>();
            mockCpfService.Setup(x => x.Validate(document)).Returns(true);

            var mockUserDataAccessService = new UserDataAccess(mockConnexaContext.Object, mockCpfService.Object);


            // Act

            // Assert
        }
    }
}