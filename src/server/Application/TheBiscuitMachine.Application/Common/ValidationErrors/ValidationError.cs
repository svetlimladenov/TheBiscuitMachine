namespace TheBiscuitMachine.Application.Common.ValidationErrors
{
    public class ValidationError
    {
        public ValidationError(string key, string message)
        {
            this.Key = key;
            this.Message = message;
        }

        public string Key { get; set; }

        public string Message { get; set; }
    }
}
