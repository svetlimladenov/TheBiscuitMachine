namespace TheBiscuitMachine.Application.Common.ValidationErrors
{
    public static class ValidationErrors
    {
        public static ValidationError UserAlreadyRegistered = new ValidationError("User", "User with this username is already registered.");

        public static ValidationError UserNotFound = new ValidationError("User", "User not found");

        public static ValidationError WrongPassword = new ValidationError("Password", "Wrong password.");
    }
}
