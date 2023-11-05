namespace PermissionAPI.Interfaces
{
    public interface IPermissionDataAccess
    {
        ValueTask<string> CreatePermissionList(string userEmail, int? listaID, int? role);
        
        ValueTask<bool> ModifyUserPermissionList(int? userID, int? listaID, bool status, int? role);

        ValueTask<bool> RevokeUserPermissionList(int userID, int listaID);

        ValueTask<bool> AlterListAccess(int listaID, bool status);
    }
}
