using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using SyncAPI.Interface;
using System.Text;
using SyncAPI.Hubs;
using SyncAPI.DTO;

namespace SyncAPI.HostedServices
{
    public class RealTimeConsumer:IHostedService
    {
        ILogger<RealTimeConsumer> _logger;
        IServiceBusPersistentConnection _persistentConnection;
        IHubContext<RealTimeHub> _realTimeHub;

        private readonly string UPDATE_LIST_OBJECT_HUB_METHOD = "UpdateListObjHub";

        public RealTimeConsumer(ILogger<RealTimeConsumer> logger, 
            IServiceBusPersistentConnection persistentConnection,
            IHubContext<RealTimeHub> realTimeHub)
        {
            _logger = logger;
            _persistentConnection = persistentConnection;
            _realTimeHub = realTimeHub;
        }

        public async Task StartAsync (CancellationToken cancellationToken)
        {
            _logger.LogInformation("Connexa Real Time Consumer [Hosted Service] started at: " + DateTime.Now);
            _ = ConsumerAsync(cancellationToken);
            await Task.CompletedTask;
        }

        protected async Task ConsumerAsync(CancellationToken stoppingToken)
        {
            try
            {
                while (!_persistentConnection.IsConnected)
                {
                    _persistentConnection.TryConnect();
                    await Task.Delay(TimeSpan.FromSeconds(1), stoppingToken);
                }

                CreateRealTimeListConsumer(stoppingToken);

                while (!stoppingToken.IsCancellationRequested)
                    await Task.Delay(TimeSpan.FromSeconds(1), stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                _logger.LogError(ex, "Connexa Real Time Service Cycle");
            }
            finally
            {
                _logger.LogInformation("Connexa Real Time Service pulse Ended");
            }
        }

        public async Task StopAsync (CancellationToken cancellationToken)
        {
            _logger.LogInformation("Connexa Real Time Consumer [Hosted Service] stoped at: " + DateTime.Now);
            await Task.CompletedTask;
        }

        private void CreateRealTimeListConsumer(CancellationToken cancellationToken)
        {
            ConfigureConsumer(_persistentConnection, "update-list-obj", "", ExchangeType.Direct, async ((ListDTO listObj, IModel model, BasicDeliverEventArgs ea) result) =>
            {
                try
                {
                    if (result.listObj == null)
                        return;

                    await SendToSignalRHub(method: UPDATE_LIST_OBJECT_HUB_METHOD,
                                        idGroup: result.listObj.IdUserTarget.ToString(),
                                        arg1: result.listObj,
                                        cancellationToken: cancellationToken);

                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, ex.Message);
                }
            }, _logger);
        }

        private async Task SendToSignalRHub(string method, string idGroup, object arg1, CancellationToken cancellationToken)
        {
            if(Hubs.RealTimeGroupManager.GroupAlreadyExists(idGroup))
                await _realTimeHub.Clients.Group(idGroup).SendAsync(method, arg1, cancellationToken);
        }

        public static void ConfigureConsumer<T>(IServiceBusPersistentConnection persistentConnection, string queue, string exchange, string exchangeType,
            Func<(T, IModel, BasicDeliverEventArgs), Task> messageExecutor, ILogger logger)
        {
            IModel model = persistentConnection.CreateModel();

            model.QueueDeclare(queue, false, false, false);
            model.BasicQos(prefetchSize: 0, prefetchCount: 1, global: false);

            AsyncEventingBasicConsumer consumer = new(model);
            consumer.Received += async (sender, ea) =>
            {
                try
                {
                    var body = ea.Body.ToArray();
                    var message = JsonConvert.DeserializeObject<T>(Encoding.UTF8.GetString(body));

                    logger?.LogDebug($"Event received: {message}");
                    await messageExecutor((message, model, ea));
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, ex.Message);
                }
            };

            model.BasicConsume(queue: queue,
                autoAck: true,
                consumer: consumer);
        }
    }
}
