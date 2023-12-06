using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using SyncAPI.DTO;
using SyncAPI.Hubs;
using System.Text;

namespace SyncAPI.HostedServices
{
    public class RealTimeConsumer:IHostedService
    {
        ILogger<RealTimeConsumer> _logger;
        IHubContext<RealTimeHub> _realTimeHub;
        ConnectionFactory _connectionFactory;
        IConnection _connection;
        IModel _channel;

        private readonly string _rbtMQHostName = "20.167.42.42";
        private readonly string _rbtMQUserName = "user";
        private readonly string _rbtMQPassword = "ziBE0cxruOs:";
        private readonly int _rbtMQPort = 5672;

        private readonly string UPDATE_LIST_OBJECT_HUB_METHOD = "UpdateListObjHub";
        private readonly string UPDATE_LIST_OBJECT_RABBIT_QUEUE = "update-list-obj";

        private readonly string UPDATE_LIST_ITEM_OBJECT_HUB_METHOD = "UpdateListItemObjHub";
        private readonly string UPDATE_LIST_ITEM_OBJECT_RABBIT_QUEUE = "update-list-item-obj";

        private readonly string DELETE_LIST_ITEM_OBJECT_HUB_METHOD = "DeleteListItemObjHub";
        private readonly string DELETE_LIST_ITEM_OBJECT_RABBIT_QUEUE = "delete-list-item-obj";

        private readonly string DELETE_LIST_OBJECT_HUB_METHOD = "DeleteListObjHub";
        private readonly string DELETE_LIST_OBJECT_RABBIT_QUEUE = "delete-list-obj";

        public RealTimeConsumer(ILogger<RealTimeConsumer> logger, 
            IHubContext<RealTimeHub> realTimeHub)
        {
            _logger = logger;
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

                CreateRealTimeUpdateListConsumer(stoppingToken);
                CreateRealTimeUpdateListItemConsumer(stoppingToken);
                
                CreateRealTimeDeleteListConsumer(stoppingToken);
                CreateRealTimeDeleteListItemConsumer(stoppingToken);

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
        private void CreateRealTimeUpdateListItemConsumer(CancellationToken cancellationToken)
        {
            ConfigureConsumer(UPDATE_LIST_ITEM_OBJECT_RABBIT_QUEUE, async ((ItemListDTO itemListObj, IModel model, BasicDeliverEventArgs ea) result) =>
            {
                try
                {
                    if (result.itemListObj == null)
                        return;

                    await SendToSignalRHub(method: UPDATE_LIST_ITEM_OBJECT_HUB_METHOD,
                                        idGroup: result.itemListObj.IdUserTarget.ToString(),
                                        arg1: result.itemListObj,
                                        cancellationToken: cancellationToken);

                    _logger.LogInformation("Updated List Item Id:" + result.itemListObj.ListaId + " was sended by SignalR to User Id: " + result.itemListObj.IdUserTarget + '.');

                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, ex.Message);
                }
            }, _logger);
        }

        private void CreateRealTimeDeleteListItemConsumer(CancellationToken cancellationToken)
        {
            ConfigureConsumer(DELETE_LIST_ITEM_OBJECT_RABBIT_QUEUE, async ((ItemListDTO itemListObj, IModel model, BasicDeliverEventArgs ea) result) =>
            {
                try
                {
                    if (result.itemListObj == null)
                        return;

                    await SendToSignalRHub(method: DELETE_LIST_ITEM_OBJECT_HUB_METHOD,
                                        idGroup: result.itemListObj.IdUserTarget.ToString(),
                                        arg1: result.itemListObj.Id,
                                        cancellationToken: cancellationToken);

                    _logger.LogInformation(DateTime.Now + ": Deleted List Item Id:" + result.itemListObj.Id + " was sended by SignalR to User Id: " + result.itemListObj.IdUserTarget + '.');

                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, ex.Message);
                }
            }, _logger);
        }

        private void CreateRealTimeDeleteListConsumer(CancellationToken cancellationToken)
        {
            ConfigureConsumer(DELETE_LIST_OBJECT_RABBIT_QUEUE, async ((ListDTO listObj, IModel model, BasicDeliverEventArgs ea) result) =>
            {
                try
                {
                    if (result.listObj == null)
                        return;

                    await SendToSignalRHub(method: DELETE_LIST_OBJECT_HUB_METHOD,
                                        idGroup: result.listObj.IdUserTarget.ToString(),
                                        arg1: result.listObj.ListaId,
                                        cancellationToken: cancellationToken);

                    _logger.LogInformation(DateTime.Now + ": Deleted List Id:" + result.listObj.ListaId + " was sended by SignalR to User Id: " + result.listObj.IdUserTarget + '.');

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

            _channel.QueueDeclare(queue, true, false, false);
            _channel.BasicQos(prefetchSize: 0, prefetchCount: 1, global: false);

            consumer.Received += async (sender, ea) =>
            {
                try
                {
                    byte[] body = ea.Body.ToArray();
                    var message = JsonConvert.DeserializeObject<T>(Encoding.UTF8.GetString(body));

                    logger.LogInformation("Evento recebido...");
                    await messageExecutor((message, _channel, ea));
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
