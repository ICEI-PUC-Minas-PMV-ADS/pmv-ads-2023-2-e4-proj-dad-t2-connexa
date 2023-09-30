using StackExchange.Redis;
using System;
using System.Data.SqlTypes;
using System.Threading.Tasks;

namespace GatewayAPI.Clients
{
    class RedisCloud
    {
        static readonly ConnectionMultiplexer redis = ConnectionMultiplexer.Connect("redis-13682.c308.sa-east-1-1.ec2.cloud.redislabs.com:13682,password=5JTSQ4XEqFYPZVwPuSSekw2RZ9GWVpBE");

        private readonly IDatabase _redisDatabase;

        public RedisCloud()
        {
            _redisDatabase = redis.GetDatabase();
        }

        public void SetRedisValue(string chave, string valor)
        {
            _redisDatabase.StringSet(chave, valor);
        }

        // Função para recuperar um valor do Redis de forma síncrona
        public string GetRedisValue(string chave)
        {
            return _redisDatabase.StringGet(chave);
        }
    }
}
