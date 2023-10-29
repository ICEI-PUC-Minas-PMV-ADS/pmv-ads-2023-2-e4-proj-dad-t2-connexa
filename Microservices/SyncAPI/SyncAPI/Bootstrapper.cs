using SyncAPI.HostedServices;

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

            // Add hosted services
            services.AddHostedService<RealTimeConsumer>();
        }
    }
}
