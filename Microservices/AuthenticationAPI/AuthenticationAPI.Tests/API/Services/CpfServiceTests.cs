using AuthenticationAPI.Services;
using FluentAssertions;

namespace AuthenticationAPI.Tests.API.Services
{
    public class CpfServiceTests
    {
        [Theory]
        [InlineData("123.456.789-09", true)]
        [InlineData("999.999.999-99", false)]
        [InlineData("12345678909", true)]
        [InlineData("123.456.789-10", false)]
        [InlineData("000.000.000-00", false)]
        [InlineData("111.222.333-44", false)]
        [InlineData("09641749013", true)]
        public void Given_AValidCpfNumber_When_ValidatingCpf_Then_ReturnsExpected(string cpf, bool expected)
        {
            // Arrange
            var cpfService = new CpfService();

            // Act
            var result = cpfService.Validate(cpf);

            // Assert
            result.Should().Be(expected);
        }
    }
}
