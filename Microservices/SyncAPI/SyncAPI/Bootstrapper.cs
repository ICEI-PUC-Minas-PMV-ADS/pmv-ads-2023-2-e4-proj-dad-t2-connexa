using SyncAPI.HostedServices;
using SyncAPI.Interface;
using SyncAPI.Model;

namespace SyncAPI
{
    public class Bootstrapper
    {
        public static void Register(IServiceCollection services)
        {

            // Add RabbitMQ configuration
            services.AddSingleton<IServiceBusPersistentConnection>(sp =>
            {
                var logger = sp.GetRequiredService<ILogger<ServiceBusPersistentConnection>>();

                var factory = new RabbitMQ.Client.ConnectionFactory()
                {
                    HostName = "localhost",
                    Port = 15672,
                    DispatchConsumersAsync = true,
                    UserName = "admin",
                    Password = "admin",
                    Ssl =
                    {
                        Enabled = true,
                        ServerName = "localhost"
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
