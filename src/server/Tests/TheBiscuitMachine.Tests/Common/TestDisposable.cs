using System;

namespace TheBiscuitMachine.Tests.Common
{
    public partial class TestOutputLogger
    {
        public class TestDisposable : IDisposable
        {
            public static readonly TestDisposable Instance = new TestDisposable();

            public void Dispose()
            {
                // intentionally does nothing
            }
        }
    }
}
