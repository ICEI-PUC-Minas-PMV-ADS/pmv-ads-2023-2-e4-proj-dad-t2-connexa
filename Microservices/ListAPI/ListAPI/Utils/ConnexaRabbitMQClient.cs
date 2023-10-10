using Microsoft.AspNetCore.Connections;
using RabbitMQ.Client;
using System.Text;
using System.Threading.Channels;

namespace ListAPI.Utils
{
    public class ConnexaRabbitMQClient
    {
        private readonly string _rbtMQHostName = "localhost";
        private readonly string _rbtMQUserName = "connexarabbit";
        private readonly string _rbtMQPassword = "12345678";
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
