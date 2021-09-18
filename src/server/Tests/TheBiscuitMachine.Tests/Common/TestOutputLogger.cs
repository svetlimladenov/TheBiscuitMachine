using System;
using Microsoft.Extensions.Logging;

namespace TheBiscuitMachine.Tests.Common
{
    // Based on: https://github.com/MassTransit/Sample-ForkJoint/blob/master/tests/ForkJoint.Tests/TestOutputLogger.cs
    public partial class TestOutputLogger : ILogger
    {
        private readonly TestOutputLoggerFactory factory;

        private readonly Func<LogLevel, bool> filter;
        private object scope;

        public TestOutputLogger(TestOutputLoggerFactory factory, bool enabled)
            : this(factory, _ => enabled)
        {
        }

        public TestOutputLogger(TestOutputLoggerFactory factory, Func<LogLevel, bool> filter)
        {
            this.factory = factory;
            this.filter = filter;
        }

        public IDisposable BeginScope<TState>(TState state)
        {
            scope = state;

            return TestDisposable.Instance;
        }

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception exception, Func<TState, Exception, string> formatter)
        {
            if (!IsEnabled(logLevel))
            {
                return;
            }

            if (formatter == null)
            {
                throw new ArgumentNullException(nameof(formatter));
            }

            var message = formatter(state, exception);

            if (string.IsNullOrEmpty(message))
            {
                return;
            }

            message = $"{DateTime.Now:HH:mm:ss.fff}-{logLevel.ToString()[0]} {message}";

            if (exception != null)
            {
                message += Environment.NewLine + Environment.NewLine + exception;
            }

            var executionContext = factory.Current;
            try
            {
                executionContext?.WriteLine(message);
            }
            catch
            {
            }
        }

        public bool IsEnabled(LogLevel logLevel)
        {
            return logLevel != LogLevel.None && filter(logLevel);
        }
    }
}
