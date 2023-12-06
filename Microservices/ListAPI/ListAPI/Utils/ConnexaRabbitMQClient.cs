using RabbitMQ.Client;
using System.Text;

namespace ListAPI.Utils
{
    public class ConnexaRabbitMQClient
    {
        private readonly string _rbtMQHostName = "20.167.42.42";
        private readonly string _rbtMQUserName = "user";
        private readonly string _rbtMQPassword = "ziBE0cxruOs:";
        private readonly int _rbtMQPort = 5672;
        private readonly ConnectionFactory _connectionFactory;
        private readonly IConnection _connection;
        private readonly IModel _channel;

        public ConnexaRabbitMQClient()
        {
            _connectionFactory = new ConnectionFactory { 
                HostName = _rbtMQHostName,
                UserName = _rbtMQUserName,
                Password = _rbtMQPassword,
                Port = _rbtMQPort
            };

            _connection = _connectionFactory.CreateConnection();
            _channel = _connection.CreateModel();
        }

        public void Publish<T> (string queue, T message)
        {
            var body = Encoding.UTF8.GetBytes(Newtonsoft.Json.JsonConvert.SerializeObject(message));

            var properties = _channel.CreateBasicProperties();
            properties.Persistent = true;

            _channel.BasicPublish(exchange: string.Empty,
                                 routingKey: queue,
                                 basicProperties: properties,
                                 body: body);
        }
    }
}
