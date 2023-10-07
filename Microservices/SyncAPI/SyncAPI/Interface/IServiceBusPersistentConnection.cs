using RabbitMQ.Client;

namespace SyncAPI.Interface
{
    public interface IServiceBusPersistentConnection : IDisposable
    {
        bool IsConnected { get; }
        IModel CreateModel ();
        bool TryConnect ();
    }
}
