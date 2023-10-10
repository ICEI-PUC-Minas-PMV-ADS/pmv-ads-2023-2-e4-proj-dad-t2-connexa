using SyncAPI.HostedServices;
using SyncAPI.Interface;
using SyncAPI.Model;

namespace SyncAPI
{
    public class Bootstrapper
    {
        private static readonly string _rbtMQConnexaUserName = "connexarabbit";
        private static readonly string _rbtMQConnexaPassword = "12345678";
        private static readonly int _rbtMQConnexaPort = 5672;
        private static readonly string _rbtMQConnexaHost = "localhost";

        public static void Register(IServiceCollection services)
        {

            // Add RabbitMQ configuration
            services.AddSingleton<IServiceBusPersistentConnection>(sp =>
            {
                var logger = sp.GetRequiredService<ILogger<ServiceBusPersistentConnection>>();

                var factory = new RabbitMQ.Client.ConnectionFactory()
                {
                    HostName = _rbtMQConnexaHost,
                    Port = _rbtMQConnexaPort,
                    UserName = _rbtMQConnexaUserName,
                    Password = _rbtMQConnexaPassword,
                    Ssl = new RabbitMQ.Client.SslOption()
                    {
                        ServerName = _rbtMQConnexaHost
                    }
                };

                var bus = new ServiceBusPersistentConnection(factory, logger, 5);

                return bus;
            });
            services.AddSingleton<IServiceBusPublisher, ServiceBusPublisher>();

            // Add hosted services
            services.AddHostedService<RealTimeConsumer>();
        }
    }
}
