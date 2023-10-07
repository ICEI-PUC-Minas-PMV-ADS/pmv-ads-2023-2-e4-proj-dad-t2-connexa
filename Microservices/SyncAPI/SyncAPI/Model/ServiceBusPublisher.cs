using Polly.Retry;
using RabbitMQ.Client.Exceptions;
using RabbitMQ.Client;
using SyncAPI.Interface;
using System.Net.Sockets;
using Polly;

namespace SyncAPI.Model
{
    public class ServiceBusPublisher : IServiceBusPublisher
    {
        private readonly IServiceBusPersistentConnection _serviceBusPersistentConnection;
        private readonly ILogger _logger;

        public ServiceBusPublisher(IServiceBusPersistentConnection serviceBusPersistentConnection, ILogger<ServiceBusPublisher> logger)
        {
            _serviceBusPersistentConnection = serviceBusPersistentConnection;
            _logger = logger;
        }

        public void Publish(string message, string exchange, string routingKey, string type)
        {
            _ = PublishAsync(message, exchange, routingKey, type);
        }

        public void PublishDirect(string message, string routinKey)
        {
            _ = PublishAsync(message, string.Empty, routinKey, ExchangeType.Direct);
        }

        public void PublishFanout(string message, string exchange)
        {
            _ = PublishAsync(message, exchange, string.Empty, ExchangeType.Fanout);
        }

        private async Task PublishAsync(string message, string exchange, string routingKey, string type)
        {
            try
            {
                if (!_serviceBusPersistentConnection.IsConnected)
                    _serviceBusPersistentConnection.TryConnect();

                var policy = RetryPolicy.Handle<BrokerUnreachableException>()
                    .Or<SocketException>()
                    .WaitAndRetry(5, retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)), (ex, time) => { });

                using (var channel = _serviceBusPersistentConnection.CreateModel())
                {
                    _logger.LogTrace("Declaring RabbitMQ queue to receive user event");
                    IBasicProperties properties = null;

                    if (type == ExchangeType.Fanout)
                    {
                        channel.ExchangeDeclare(exchange: exchange, type: type);
                    }
                    else
                    {
                        properties = channel.CreateBasicProperties();
                        properties.DeliveryMode = 2; // persistent
                        
                        channel.QueueDeclare(queue: routingKey,
                            durable: false,
                            exclusive: false,
                            autoDelete: false,
                            arguments: null);
                    }
                    
                    policy.Execute(() =>
                    {
                        var body = System.Text.Encoding.UTF8.GetBytes(message);
                        channel.BasicPublish(
                            exchange: exchange,
                            routingKey: routingKey,
                            basicProperties: properties,
                            body: body);
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Service Bus Message");
            }

            await Task.CompletedTask;
        }
    }
}
