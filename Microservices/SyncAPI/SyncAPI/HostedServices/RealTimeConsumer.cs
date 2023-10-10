using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using SyncAPI.Interface;
using System.Text;
using SyncAPI.Hubs;
using SyncAPI.DTO;
using System.Threading.Channels;
using Microsoft.Extensions.Logging;

namespace SyncAPI.HostedServices
{
    public class RealTimeConsumer:IHostedService
    {
        ILogger<RealTimeConsumer> _logger;
        IServiceBusPersistentConnection _persistentConnection;
        IHubContext<RealTimeHub> _realTimeHub;
        ConnectionFactory _connectionFactory;
        IConnection _connection;
        IModel _channel;

        private readonly string _rbtMQHostName = "localhost";
        private readonly string _rbtMQUserName = "connexarabbit";
        private readonly string _rbtMQPassword = "12345678";
        private readonly int _rbtMQPort = 5672;

        private readonly string UPDATE_LIST_OBJECT_HUB_METHOD = "UpdateListObjHub";
        private readonly string UPDATE_LIST_OBJECT_RABBIT_QUEUE = "update-list-obj";

        public RealTimeConsumer(ILogger<RealTimeConsumer> logger, 
            IServiceBusPersistentConnection persistentConnection,
            IHubContext<RealTimeHub> realTimeHub)
        {
            _logger = logger;
            _persistentConnection = persistentConnection;
            _realTimeHub = realTimeHub;

            _connectionFactory = new ConnectionFactory { 
                HostName = _rbtMQHostName,
                UserName = _rbtMQUserName,
                Password = _rbtMQPassword,
                Port = _rbtMQPort
            };

            _connection = _connectionFactory.CreateConnection();
            _channel = _connection.CreateModel();

            var properties = _channel.CreateBasicProperties();
            properties.Persistent = true;
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

                CreateRealTimeUpdateListConsumer(stoppingToken);

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

        private void CreateRealTimeUpdateListConsumer(CancellationToken cancellationToken)
        {
            ConfigureConsumer(UPDATE_LIST_OBJECT_RABBIT_QUEUE, async ((ListDTO listObj, IModel model, BasicDeliverEventArgs ea) result) =>
            {
                try
                {
                    if (result.listObj == null)
                        return;

                    await SendToSignalRHub(method: UPDATE_LIST_OBJECT_HUB_METHOD,
                                        idGroup: result.listObj.IdUserTarget.ToString(),
                                        arg1: result.listObj,
                                        cancellationToken: cancellationToken);

                    _logger.LogInformation("Updated List Id:" + result.listObj.ListaId + " was sended by SignalR to User Id: " + result.listObj.IdUserTarget + '.');

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

        public void ConfigureConsumer<T>(string queue,
            Func<(T, IModel, BasicDeliverEventArgs), Task> messageExecutor, ILogger logger)
        {
            var consumer = new EventingBasicConsumer(_channel);
            consumer.Received += async (sender, ea) =>
            {
                try
                {
                    byte[] body = ea.Body.ToArray();
                    var obj = JsonConvert.DeserializeObject<T>(Encoding.UTF8.GetString(body));

                    _channel.QueueDeclare(queue, false, false, false);
                    _channel.BasicQos(prefetchSize: 0, prefetchCount: 1, global: false);
                    
                    await messageExecutor((obj, _channel, ea));
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, ex.Message);
                }
            };

            _channel.BasicConsume(queue: queue,
                     autoAck: true,
                     consumer: consumer);

            logger.LogInformation("Queue: " + queue + " is awaiting updates from RabbitMQ...");
        }
    }
}
