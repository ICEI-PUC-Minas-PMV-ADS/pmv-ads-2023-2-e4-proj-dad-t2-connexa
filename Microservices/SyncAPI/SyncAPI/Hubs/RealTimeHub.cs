using Microsoft.AspNetCore.SignalR;
using System;

namespace SyncAPI.Hubs
{
    public class RealTimeHub : Hub
    {
        readonly ILogger<RealTimeHub> _logger;
        public RealTimeHub(ILogger<RealTimeHub> logger)
        {
            _logger = logger;
        }

        [HubMethodName("Subscribe")]
        async public Task Subscribe(int userId)
        {
            try
            {
                var groupManager = RealTimeGroupManager.FromGroupManager(this.Groups);
                var notificationGroup = new RealTimeUserGroup(userId, Context.ConnectionId);
                await groupManager.Add(notificationGroup);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
            }
        }

        [HubMethodName("Unsubscribe")]
        public async Task Unsubscribe(int userId)
        {
            try
            {
                var groupManager = RealTimeGroupManager.FromGroupManager(this.Groups);
                var notificationGroup = new RealTimeUserGroup(userId, Context.ConnectionId);
                await groupManager.Remove(notificationGroup);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
            }
        }

        public override Task OnConnectedAsync()
        {
            _logger.LogInformation(this.Context.ConnectionId + " connected to signalR.");
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            _logger.LogInformation(this.Context.ConnectionId + " desconnected to signalR.");
            return base.OnDisconnectedAsync(exception);
        }
    }

    public class RealTimeGroupManager
    {
        static readonly List<RealTimeUserGroup> _realTimeUserGroups = new List<RealTimeUserGroup>();
        readonly IGroupManager internalGroupManager;

        public static RealTimeGroupManager FromGroupManager(IGroupManager groupManager)
        {
            if (groupManager == null)
                throw new ArgumentNullException("groupManager");

            return new RealTimeGroupManager(groupManager);
        }
        public static string[] GetNotificationGroups()
        {
            return _realTimeUserGroups.Select(s => s.UserId.ToString()).ToArray();
        }

        public static List<string> GetUserConnectionId(int idUser)
        {
            return _realTimeUserGroups.Where(x => x.UserId == idUser).Select(x => x.ConnectionId).ToList();
        }

        private RealTimeGroupManager(IGroupManager groupManager)
        {
            internalGroupManager = groupManager;
        }

        public async Task Add(RealTimeUserGroup notificationUserGroup)
        {
            var existentConnection = _realTimeUserGroups.FirstOrDefault(u => u.UserId == notificationUserGroup.UserId);

            if(existentConnection != null)
            {
                await internalGroupManager.RemoveFromGroupAsync(existentConnection.ConnectionId, existentConnection.UserId.ToString());
                _realTimeUserGroups.Remove(existentConnection);
            }

            _realTimeUserGroups.Add(notificationUserGroup);
            await internalGroupManager.AddToGroupAsync(notificationUserGroup.ConnectionId, notificationUserGroup.UserId.ToString());
        }

        public async Task Remove(RealTimeUserGroup notificationGroup)
        {
            var notificationUserGroup = _realTimeUserGroups.FirstOrDefault(n => n.UserId == notificationGroup.UserId);
            if(notificationUserGroup != null)
            {
                _realTimeUserGroups.Remove(notificationUserGroup);
                await internalGroupManager.RemoveFromGroupAsync(notificationGroup.ConnectionId, notificationGroup.UserId.ToString());
            }
        }

        public static bool GroupAlreadyExists(string idGroup)
        {
            var groups = GetNotificationGroups();
            return (groups != null && groups.Length > 0 && groups.Contains(idGroup));
        }
    }

    public class RealTimeUserGroup
    {
        public int UserId { get; set; }

        public string ConnectionId { get; set; }

        public RealTimeUserGroup(int id, string connectionId)
        {
            UserId = id;
            ConnectionId = connectionId;
        }
    }
}
