namespace TheBiscuitMachine.Application.Common.ValidationErrors
{
    public static class ValidationErrors
    {
        public static ValidationError UserAlreadyRegistered = new ValidationError("User", "User with this username is already registered.");

        public static ValidationError UserNotFound = new ValidationError("User", "Use not found");
    }
}
