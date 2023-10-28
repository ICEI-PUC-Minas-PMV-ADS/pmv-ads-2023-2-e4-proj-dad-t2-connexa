using AuthenticationAPI.Auth;
using AuthenticationAPI.DTOs;
using AuthenticationAPI.Interfaces;
using AuthenticationAPI.Models;
using AuthenticationAPI.Tests.TestUtilities.TesteHost;
using AutoFixture;
using FakeItEasy;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using System.Net.Http.Headers;
using System.Text;

namespace AuthenticationAPI.Tests.API
{
    public class ProgramTests
    {
        // Padrão utilizado na nomenclatura dos testes:
        //Given_Preconditions_When_StateUnderTest_Then_ExpectedBehavior

        [Fact]
        public async Task Given_AValidEmail_When_GettingUserByEmail_Then_Returns200Ok()
        {
            // Arrange

            // Cria um IUserDataAccess usando a biblioteca FakeItEasy, para não acessar a
            // instância real que iria consultar o banco de dados na nuvem.
            var fakeUserDataAccess = A.Fake<IUserDataAccess>();

            using var testServerContainer = new TestServerContainer(serviceCollection =>
            {
                // Substitui o IUserDataAccess real pelo IUserDataAccess fake dentro do ambiente de teste.
                serviceCollection.AddScoped(factory => fakeUserDataAccess);
            });

            var fixture = new Fixture(); // Biblioteca que facilita os testes, utilizada para gerar objetos autmaticamente, sem a necessidade de ficar
                                         // se preocupando com o preenchimento das propriedades. Ela permite personlização com o "With".

            fixture.Behaviors.Add(new OmitOnRecursionBehavior());
            fixture.Customize<DateOnly>(composer => composer.FromFactory<DateTime>(DateOnly.FromDateTime));

            var testUser = fixture.Build<User>().With(x => x.UserName, "My Test User").Create();

            var jwtGenerator = new JwtHandler();
            var jwtToken = jwtGenerator.GenerateToken(testUser);

            // Usa o HttpClient que servirá para fazer requests no ambiente de testes.
            var httpClient = testServerContainer.HttpClient;

            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", jwtToken);

            var resource = "/users?email=email@test.com";

            // Act
            var response = await httpClient.GetAsync(resource);

            // Assert
            response.Should().Be200Ok();
        }

        [Fact]
        public async Task Given_AValidUser_When_CreatingUser_Then_Returns201Created()
        {
            // Arrange
            const string requestJson =
                @"{
                    ""email"" : ""email@test.com"",
                    ""password"": ""123456789"",
                    ""name"":""TestUser"",
                    ""document"":""111111111111"",
                    ""birthdate"":""2023-10-23"",
                    ""secretQuestion"":""test?"",
                    ""secretAnswer"":""test""
                }";

            var fakeUserDataAccess = A.Fake<IUserDataAccess>();

            A.CallTo(() => fakeUserDataAccess.SaveUserAsync(A<CreateOrUpdateUserDTO>.Ignored)).Returns(true);

            using var testServerContainer = new TestServerContainer(serviceCollection =>
            {
                serviceCollection.AddScoped(factory => fakeUserDataAccess);
            });

            var httpClient = testServerContainer.HttpClient;

            var resource = "/users";

            var body = new StringContent(requestJson, Encoding.UTF8, "application/json");

            // Act
            var response = await httpClient.PostAsync(resource, body);

            // Assert
            response.Should().Be201Created();
        }

        [Fact]
        public async Task Given_AValidUser_When_AnErrorOccursCreatingUser_Then_Returns400BadRequest()
        {
            // Arrange
            const string requestJson =
                @"{
                    ""email"" : ""email@test.com"",
                    ""password"": ""123456789"",
                    ""name"":""TestUser"",
                    ""document"":""111111111111"",
                    ""birthdate"":""2023-10-23"",
                    ""secretQuestion"":""test?"",
                    ""secretAnswer"":""test""
                }";

            var fakeUserDataAccess = A.Fake<IUserDataAccess>();

            A.CallTo(() => fakeUserDataAccess.SaveUserAsync(A<CreateOrUpdateUserDTO>.Ignored)).Returns(false);

            using var testServerContainer = new TestServerContainer(serviceCollection =>
            {
                serviceCollection.AddScoped(factory => fakeUserDataAccess);
            });

            var httpClient = testServerContainer.HttpClient;

            var resource = "/users";

            var body = new StringContent(requestJson, Encoding.UTF8, "application/json");

            // Act
            var response = await httpClient.PostAsync(resource, body);

            // Assert
            response.Should().Be400BadRequest();
        }

        [Fact]
        public async Task Given_AValidEmail_When_DeletingUser_Then_Returns204NoContent()
        {
            // Arrange
            var fakeUserDataAccess = A.Fake<IUserDataAccess>();

            A.CallTo(() => fakeUserDataAccess.DeleteUserAsync(A<string>.Ignored)).Returns(true);

            using var testServerContainer = new TestServerContainer(serviceCollection =>
            {
                serviceCollection.AddScoped(factory => fakeUserDataAccess);
            });

            var fixture = new Fixture();
            fixture.Behaviors.Add(new OmitOnRecursionBehavior());
            fixture.Customize<DateOnly>(composer => composer.FromFactory<DateTime>(DateOnly.FromDateTime));

            var testUser = fixture.Build<User>().With(x => x.UserName, "My Test User").Create();

            var jwtGenerator = new JwtHandler();
            var jwtToken = jwtGenerator.GenerateToken(testUser);

            var httpClient = testServerContainer.HttpClient;

            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", jwtToken);

            var resource = "/users?email=email@test.com";

            // Act
            var response = await httpClient.DeleteAsync(resource);

            // Assert
            response.Should().Be204NoContent();
        }

        [Fact]
        public async Task Given_AValidEmail_When_AnErrorOccursDeletingUser_Then_Returns400BadRequest()
        {
            // Arrange
            var fakeUserDataAccess = A.Fake<IUserDataAccess>();

            A.CallTo(() => fakeUserDataAccess.DeleteUserAsync(A<string>.Ignored)).Returns(false);

            using var testServerContainer = new TestServerContainer(serviceCollection =>
            {
                serviceCollection.AddScoped(factory => fakeUserDataAccess);
            });

            var fixture = new Fixture();
            fixture.Behaviors.Add(new OmitOnRecursionBehavior());
            fixture.Customize<DateOnly>(composer => composer.FromFactory<DateTime>(DateOnly.FromDateTime));

            var testUser = fixture.Build<User>().With(x => x.UserName, "My Test User").Create();

            var jwtGenerator = new JwtHandler();
            var jwtToken = jwtGenerator.GenerateToken(testUser);

            var httpClient = testServerContainer.HttpClient;

            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", jwtToken);

            var resource = "/users?email=email@test.com";

            // Act
            var response = await httpClient.DeleteAsync(resource);

            // Assert
            response.Should().Be400BadRequest();
        }

        [Fact]
        public async Task Given_AValidUser_When_ValidatingUser_Then_Returns200Ok()
        {
            // Arrange
            const string requestJson =
                @"{
                     ""email"": ""email@test.com"",
                     ""password"": ""123456789""
                }";

            var fixture = new Fixture();
            fixture.Behaviors.Add(new OmitOnRecursionBehavior());
            fixture.Customize<DateOnly>(composer => composer.FromFactory<DateTime>(DateOnly.FromDateTime));

            var testUser = fixture.Build<User>().With(x => x.UserName, "My Test User").Create();

            var fakeUserDataAccess = A.Fake<IUserDataAccess>();

            A.CallTo(() => fakeUserDataAccess.ValidateLoginUserAsync(A<LoginUserDTO>.Ignored)).Returns(testUser);

            using var testServerContainer = new TestServerContainer(serviceCollection =>
            {
                serviceCollection.AddScoped(factory => fakeUserDataAccess);
            });

            var httpClient = testServerContainer.HttpClient;

            var resource = "/users/validate";

            var body = new StringContent(requestJson, Encoding.UTF8, "application/json");

            // Act
            var response = await httpClient.PostAsync(resource, body);

            // Assert
            response.Should().Be200Ok();
        }

        [Fact]
        public async Task Given_AValidUser_When_AnErrorOccursValidantingUser_Then_Returns400BadRequest()
        {
            // Arrange
            const string requestJson =
                @"{
                    
                     ""email"": ""email@test.com"",
                     ""password"": ""123456789""
                    
                }";

            var fakeUserDataAccess = A.Fake<IUserDataAccess>();

            A.CallTo(() => fakeUserDataAccess.ValidateLoginUserAsync(A<LoginUserDTO>.Ignored)).Returns(null);

            using var testServerContainer = new TestServerContainer(serviceCollection =>
            {
                serviceCollection.AddScoped(factory => fakeUserDataAccess);
            });

            var httpClient = testServerContainer.HttpClient;

            var resource = "/users/validate";

            var body = new StringContent(requestJson, Encoding.UTF8, "application/json");

            // Act
            var response = await httpClient.PostAsync(resource, body);

            // Assert
            response.Should().Be400BadRequest();
        }

        [Fact]
        public async Task Given_AValidEmail_When_GettingSecretQuestion_Then_Returns200Ok()
        {
            // Arrange
            var fakeUserDataAccess = A.Fake<IUserDataAccess>();

            using var testServerContainer = new TestServerContainer(serviceCollection =>
            {
                serviceCollection.AddScoped(factory => fakeUserDataAccess);
            });


            var httpClient = testServerContainer.HttpClient;

            var email = "email@test.com";
            var resource = $"/users/secret-question?email={email}";

            // Act
            var response = await httpClient.GetAsync(resource);

            // Assert

            Assert.Equal(200, (int)response.StatusCode);
            var responseContent = await response.Content.ReadAsStringAsync();

        }
    }
}
