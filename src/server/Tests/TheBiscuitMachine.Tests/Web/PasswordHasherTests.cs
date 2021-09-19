using TheBiscuitMachine.Web.Services;
using Xunit;

namespace TheBiscuitMachine.Tests.Web
{
    public class PasswordHasherTests
    {
        [Fact]
        public void VerifyHashedPassword_Should_ReturnTrue_WhenPasswordIsCorrect()
        {
            const string password = "VeryStrongPassword1234";

            var hasher = new BiscuitMachinePasswordHasher();

            var savedPasswordHash = hasher.HashPassword(password);

            var result = hasher.VerifyHashedPassword(savedPasswordHash, password);
            Assert.True(result);
        }

        [Theory]
        [InlineData("VeryStrongPassword1234", "VeryStringWrongPassword")]
        [InlineData("aaaaaaaaA", "aaaaaaaaa")]
        public void VerifyHashedPassword_Should_ReturnFalse_WhenPasswordIsNOTCorrect(string password, string wrongPassword)
        {
            var hasher = new BiscuitMachinePasswordHasher();

            var savedPasswordHash = hasher.HashPassword(password);

            var result = hasher.VerifyHashedPassword(savedPasswordHash, wrongPassword);
            Assert.False(result);
        }
    }
}
