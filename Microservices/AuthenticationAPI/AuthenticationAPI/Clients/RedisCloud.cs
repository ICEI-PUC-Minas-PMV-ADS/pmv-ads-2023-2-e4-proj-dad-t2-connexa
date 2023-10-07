using StackExchange.Redis;
using System;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;

namespace AuthenticationAPI.Clients
{
    class RedisCloud
    {
        
        static readonly ConnectionMultiplexer redis = ConnectionMultiplexer.Connect("redis-13682.c308.sa-east-1-1.ec2.cloud.redislabs.com:13682,password=5JTSQ4XEqFYPZVwPuSSekw2RZ9GWVpBE");

        private readonly IDatabase _redisDatabase = redis.GetDatabase();

        public void SetRedisValue(string chave, string valor)
        {
            _redisDatabase.StringSet(chave, valor, TimeSpan.FromMinutes(5));
        }

        public string GetRedisValue(string chave)
        {
            return _redisDatabase.StringGet(chave);
        }
    }
}