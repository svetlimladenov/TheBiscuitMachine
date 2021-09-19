namespace TheBiscuitMachine.Application.Common.Interfaces
{
    public interface IBiscuitMachinePasswordHasher
    {
        string HashPassword(string password);

        bool VerifyHashedPassword(string hashedPassword, string providerPassword);
    }
}
