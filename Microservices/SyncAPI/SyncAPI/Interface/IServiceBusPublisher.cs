namespace SyncAPI.Interface
{
    public interface IServiceBusPublisher
    {
        void Publish(string message, string exchange, string routingKey, string type);
        void PublishDirect(string message, string routinKey);
        void PublishFanout(string message, string exchange);
    }
}
