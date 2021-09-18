using Microsoft.Extensions.Logging;
using Xunit.Abstractions;

namespace TheBiscuitMachine.Tests.Common
{
    // Based on https://github.com/MassTransit/Sample-ForkJoint/blob/master/tests/ForkJoint.Tests/TestOutputLoggerFactory.cs
    // With implementation working for xUnit outputs
    public class TestOutputLoggerFactory : ILoggerFactory
    {
        private readonly bool enabled;

        public TestOutputLoggerFactory(bool enabled, ITestOutputHelper outputHelper = null)
        {
            this.enabled = enabled;
            Current = outputHelper;
        }

        public ITestOutputHelper Current { get; set; }

        public ILogger CreateLogger(string name)
        {
            return new TestOutputLogger(this, enabled);
        }

        public void AddProvider(ILoggerProvider provider)
        {
        }

        public void Dispose()
        {
        }
    }
}
