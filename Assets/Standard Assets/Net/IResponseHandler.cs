using System.Collections.Generic;

namespace KBN
{
    public delegate void OKHandler(byte[] data);
    public delegate void ErrorHandler(string errorMessage, string errorCode);

    public interface IResponseHandler
    {
        void OKHandler(byte[] data);
        void ErrorHandler(string errorMessage, string errorCode);
    }
}
