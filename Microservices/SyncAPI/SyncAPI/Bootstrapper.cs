using SyncAPI.HostedServices;

namespace SyncAPI
{
    public class Bootstrapper
    {
        public static void Register(IServiceCollection services)
        { 

            // Add hosted services
            services.AddHostedService<RealTimeConsumer>();
        }
    }
}
