//using System.Text;
//using RabbitMQ.Client;
//using RabbitMQ.Client.Events;

//var factory = new ConnectionFactory { 
//    HostName = "localhost",
//    UserName = "connexarabbit",
//    Password = "12345678",
//    Port = 5672
//};

//using var connection = factory.CreateConnection();
//using var channel = connection.CreateModel();

//channel.QueueDeclare(queue: "update-list-obj",
//                     durable: true,
//                     exclusive: false,
//                     autoDelete: false,
//                     arguments: null);

//var message = new ListDTO()
//{
//    IdUserTarget = 1,
//    ListaDescricao = "List descrição",
//    ListaId = 1,
//    ListaPublica = true,
//    ListaStatus = true,
//    ListaTitulo = "Lista Titulo",
//    UserId = 1,
//};

//var body = Encoding.UTF8.GetBytes(Newtonsoft.Json.JsonConvert.SerializeObject(message));

//var properties = channel.CreateBasicProperties();
//properties.Persistent = true;

//channel.BasicPublish(exchange: string.Empty,
//                     routingKey: "update-list-obj",
//                     basicProperties: properties,
//                     body: body);

//var consumer = new EventingBasicConsumer(channel);
//consumer.Received += (model, ea) =>
//{
//    byte[] body = ea.Body.ToArray();
//    var message = Encoding.UTF8.GetString(body);
//    var obj = Newtonsoft.Json.JsonConvert.DeserializeObject<ListDTO>(message);

//    Console.WriteLine("============= Dados atualizados =============");
//    Console.WriteLine("Id da lista:" + obj.ListaId);
//    Console.WriteLine("Titulo da lista:" + obj.ListaTitulo);
//    Console.WriteLine("Descrição da lista:" + obj.ListaDescricao);
//    Console.WriteLine("============= Dados atualizados =============");
//};

//channel.BasicConsume(queue: "update-list-obj",
//                     autoAck: true,
//                     consumer: consumer);

//Console.WriteLine("Aguardando atualizações...");
//Console.ReadKey();

using System.Collections.Generic;
using System.Net;
using Microsoft.AspNetCore.SignalR.Client;

var hubConnection = new HubConnectionBuilder()
                            .WithUrl("https://localhost:7150/gateway/sync/realtime")
                            .Build();

hubConnection.On<ListDTO>("UpdateListObjHub", async (list) =>
{
    Console.WriteLine("============= Dados atualizados =============");
    Console.WriteLine("Id da lista:" + list.ListaId);
    Console.WriteLine("Titulo da lista:" + list.ListaTitulo);
    Console.WriteLine("Descrição da lista:" + list.ListaDescricao);
    Console.WriteLine("============= Dados atualizados =============");
});

int idUser = 1;

try
{
    CreateSignalRConnection();
} catch(Exception ex)
{
    Console.WriteLine();
}
finally
{
    PersistenceConnection();
}

Console.WriteLine("esperando atualizações...");

Console.ReadKey();

async void PersistenceConnection ()
{
    while(true)
    {
        if(hubConnection.State == HubConnectionState.Disconnected)
        {
            CreateSignalRConnection();
        }
    }
}

async void CreateSignalRConnection ()
{
    try
    {
        await hubConnection.StartAsync();
        await hubConnection.InvokeAsync("UnSubscribe", idUser);
        await hubConnection.InvokeAsync("Subscribe", idUser);

        Console.WriteLine("Connected to the sync service.");
    }
    catch(Exception ex)
    {
        Console.WriteLine(ex.Message);
    }finally 
    {
        await Task.Delay(1500);
    }
}

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
