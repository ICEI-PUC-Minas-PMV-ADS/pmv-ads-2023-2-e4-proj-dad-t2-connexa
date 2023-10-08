using System.Text;
using RabbitMQ.Client;

var factory = new ConnectionFactory { 
    HostName = "localhost",
    UserName = "connexarabbit",
    Password = "12345678", 
    Port = 5672
};

using var connection = factory.CreateConnection();
using var channel = connection.CreateModel();

//channel.QueueDeclare(queue: "update-list-obj",
//                     durable: true,
//                     exclusive: false,
//                     autoDelete: false,
//                     arguments: null);

var message = new ListDTO()
{
    IdUserTarget = 1,
    ListaDescricao = "List descrição",
    ListaId = 1,
    ListaPublica = true,
    ListaStatus = true,
    ListaTitulo = "Lista Titulo",
    UserId = 1,
};

var body = Encoding.UTF8.GetBytes(Newtonsoft.Json.JsonConvert.SerializeObject(message));

var properties = channel.CreateBasicProperties();
properties.Persistent = true;

channel.BasicPublish(exchange: string.Empty,
                     routingKey: "update-list-obj",
                     basicProperties: properties,
                     body: body);

Console.WriteLine($" [x] Sent {message}");

Console.WriteLine(" Press [enter] to exit.");

public class ListDTO
{
    public int ListaId { get; set; }

    public int? UserId { get; set; }

    public bool ListaPublica { get; set; }

    public bool ListaStatus { get; set; }

    public string? ListaDescricao { get; set; }

    public string? ListaTitulo { get; set; }

    public int IdUserTarget { get; set; }
}
